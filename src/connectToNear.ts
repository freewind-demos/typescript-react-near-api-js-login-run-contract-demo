import {connect, keyStores, Near} from 'near-api-js';

export async function connectToNear(
    network: string,
    rpcNodeUrl: string
): Promise<Near> {
    const near = await connect({
        networkId: network,
        nodeUrl: rpcNodeUrl,
        headers: {},
        // walletUrl: "https://wallet.testnet.near.org",
        // helperUrl: "https://helper.testnet.near.org",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    });
    return near;
}
