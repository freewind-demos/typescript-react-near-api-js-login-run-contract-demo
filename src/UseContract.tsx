import React, {FC, useEffect, useState} from 'react';
import {connect, keyStores, WalletConnection} from 'near-api-js';
import {useRequest} from 'ahooks';

type Props = {
    // a hello contract, has methods:
    // - view: hello()
    // - change: set_name(name: string)
    contract: string;
};

async function buildNewWalletConnection() {
    const near = await connect({
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        headers: {},
        walletUrl: 'https://testnet.mynearwallet.com',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'bbb'),
    })
    console.log("### build new WalletConnection")
    return new WalletConnection(near, 'aaa')
}

export const UseContract: FC<Props> = ({contract}) => {
    const [, reRender] = useState({})
    const [newName, setNewName] = useState('new-name' + Date.now())
    const [walletConnection, setWalletConnection] = useState<WalletConnection>();

    useEffect(() => {
        setInterval(() => {
            buildNewWalletConnection().then((r) => setWalletConnection(r));
        }, 1000)
    }, [])

    useEffect(() => {
        console.log("### walletConnection is changed", walletConnection);
        (async () => {
            const accessKeys = await walletConnection?.account().getAccessKeys();
            console.log("### accessKeys", accessKeys)
        })();
    }, [walletConnection])


    const login = useRequest(async () => {
        const connection = await buildNewWalletConnection()
        await connection.requestSignIn(contract)
    }, {
        manual: true
    })

    function logout() {
        walletConnection?.signOut();
        reRender({});
    }

    const changeName = useRequest(async () => {
        const result = await walletConnection?.account().functionCall(contract, 'set_name', {
            name: newName
        })
        alert(`change name on chain to: ${newName}`);
        await console.log("result", result)
    }, {
        manual: true,
        onSuccess: () => setNewName(`new-name-${Date.now()}`)
    })

    async function sayHello() {
        const result = await walletConnection?.account().viewFunction(contract, 'hello')
        await alert(result)
    }

    return <div>
        <div>isSignedIn: {JSON.stringify(walletConnection?.isSignedIn())}</div>
        <div>getAccountId: {JSON.stringify(walletConnection?.getAccountId())}</div>
        <hr/>
        {walletConnection
            ? walletConnection.isSignedIn()
                ? <>
                    <div>
                        {walletConnection?.getAccountId()}
                        <button onClick={() => logout()}>Logout</button>
                    </div>
                    <button disabled={changeName.loading} onClick={() => changeName.run()}>
                        Change name to new value: {newName}
                    </button>
                    <button onClick={() => sayHello()}>Hello</button>
                </>
                : <button onClick={() => login.run()} disabled={login.loading}>Login</button>
            : <div>Loading ...</div>
        }
    </div>
}
