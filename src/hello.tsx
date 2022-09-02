import React, {FC, useEffect, useState} from 'react';
import {connect, keyStores, WalletConnection} from 'near-api-js';
import {useRequest} from 'ahooks';

type Props = {};

// a hello contract, has methods:
// - view: hello()
// - change: set_name(name: string)
const CONTRACT = 'dev-1662047072386-78404893666850';

export const Hello: FC<Props> = ({}) => {
    const [walletConnection, setWalletConnection] = useState<WalletConnection>();
    const [newName, setNewName] = useState('new-name' + Date.now())

    useEffect(() => {
        async function connectToNear() {
            const near = await connect({
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                headers: {},
                walletUrl: 'https://testnet.mynearwallet.com',
                keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            })
            return new WalletConnection(near, null);
        }

        connectToNear().then(setWalletConnection);
    }, [])

    async function login() {
        await walletConnection?.requestSignIn(CONTRACT, 'Hello App')
    }

    function logout() {
        walletConnection?.signOut();
    }

    const changeName = useRequest(async () => {
        const result = await walletConnection?.account().functionCall(CONTRACT, 'set_name', {
            name: newName
        })
        alert(`change name on chain to: ${newName}`);
        console.log("result", result);
    }, {
        manual: false,
        onSuccess: () => setNewName(`new-name-${Date.now()}`)
    })

    async function sayHello() {
        const result = await walletConnection?.account().viewFunction(CONTRACT, 'hello')
        alert(result);
    }

    return <>
        {walletConnection?.isSignedIn()
            ? <>
                <div>{walletConnection?.getAccountId()}</div>
                <button disabled={changeName.loading} onClick={() => changeName.run()}>
                    Change name to new value: {newName}
                </button>
                <button onClick={() => sayHello()}>Hello</button>
                <hr/>
                <button onClick={() => logout()}>Logout</button>
            </>
            : <button onClick={() => login()}>Login</button>
        }
    </>
}
