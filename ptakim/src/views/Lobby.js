import React, {useEffect} from 'react';
import {usePubNub} from "pubnub-react";


function Lobby() {
    let pubnub = usePubNub();

    const testi = async () => {
        let res = await pubnub.whereNow({uuid: pubnub.uuid})
        console.log(res);
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
