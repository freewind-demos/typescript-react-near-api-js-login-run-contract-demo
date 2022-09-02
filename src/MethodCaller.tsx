import type {FC} from "react";
import React, {useState} from "react";
import {Contract} from "near-api-js";

type Props = {
    view: boolean,
    method: string
    contract: Contract,
    accountId: string
}

export const MethodCaller: FC<Props> = React.memo(({view, method, contract, accountId}) => {
    const [args, setArgs] = useState<string>()

    async function call() {
        if (view) {
            const result = await contract.account.viewFunction(contract.contractId, method);
            console.log("### view result", result);
        } else {
            const result = await contract.account.functionCall(contract.contractId, method, {
                "name": "rust333",
                account_id: "freewind.testnet"
            })
            console.log("### call result", result);
        }
    }

    return <div>
        <span>{method}:</span>
        <textarea value={args ?? ''} onChange={event => setArgs(event.target.value)} rows={5}/>
        <button onClick={() => call()}>{view ? 'View' : 'Call'}</button>
    </div>
})
