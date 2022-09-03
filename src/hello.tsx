import React, {FC} from 'react';
import {UseContract} from "./UseContract";

export const Hello: FC = () => {
    return <>
        <div style={{padding: 20, border: '1px solid red', marginBottom: 20}}>
            <UseContract contract={'dev-1662047072386-78404893666850'}/>
        </div>
        <div style={{padding: 20, border: '1px solid red'}}>
            <UseContract contract={'dev-1662118315419-35958528067003'}/>
        </div>
    </>
}
