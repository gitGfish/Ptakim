import React, {useEffect, useState} from 'react';
import PubNub from 'pubnub';
import {usePubNub} from 'pubnub-react';




function Game(props) {
    const pubnub = usePubNub();
    const [connected_clients, setConnectedClients] = useState([]);

    const check_players = () => {
        pubnub.hereNow(
            {
                channels: [props.channel]
            },
            function (status, response) {
                let occupants_list = response.channels[props.channel].occupants.map((occ) => {
                    return occ.uuid
                })
                setConnectedClients(occupants_list);
            }
        )
    }

    useEffect(() => {
        check_players();
        pubnub.addListener({
            presence: function(event) {
                let action = event.action;
                let channelName = event.channel;
                let occupancy = event.occupancy;
                let eventTimetoken = event.timetoken;
                let occupantUUID = event.uuid;
                let state = event.state;
                let subscribeManager = event.subscription;
                console.log(`accepting event of ${action} with uuid ${occupantUUID}`)
                if(action === 'join'){
                    setConnectedClients(connected => [...connected, occupantUUID]);
                }else if (action === 'leave' || action === 'timeout'){
                    setConnectedClients(connected => connected.filter((uuid) => (uuid !== occupantUUID)))
                }
            }
        });
    }, []);


    return (
        <div>
            <h1>CONNECTED PLAYERS : </h1>
            <ul>
                {connected_clients.map((player, idx) => {
                    return <li key={idx}>{player}</li>
                })}
            </ul>
        </div>
    );
}

export default Game;
