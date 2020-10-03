import React, {useEffect} from 'react';
import {usePubNub} from "pubnub-react";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function Lobby() {
    let pubnub = usePubNub();

    const testi = async () => {
        await sleep(3000);
        let res = await pubnub.whereNow({uuid: pubnub.getUUID()})
        console.log(res);
        console.log(pubnub.getUUID());
    }

    useEffect(() => {
        testi();
    }, []);


    return (
        <div>
            <h1>ASLDKHJ</h1>
        </div>
    );
}

export default Lobby;
