import React, {useEffect, useState} from 'react';
import { usePubNub } from 'pubnub-react';

const our_channels = ['yeah'];




function MainMenu() {
    const pubnub = usePubNub();
    const [connected, setConnected] = useState([])

    const initializeConnected = () => {
        pubnub.hereNow(
            {
                channels: our_channels,
                includeState: true
            },
            function (status, response) {
                let occupants_list = response.channels[our_channels[0]].occupants.map((occ) => {
                    return occ.uuid
                })
                setConnected(occupants_list);
            }
        );
    }

    const activate = async () => {
        await pubnub.addListener({
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
                    setConnected(connected => [...connected, occupantUUID]);
                }else if (action === 'leave'){
                    setConnected(connected => connected.filter((uuid) => (uuid !== occupantUUID)))
                }
            }
        });
        await pubnub.subscribe({channels: our_channels, withPresence: true});
        await initializeConnected();
    }

    useEffect(() => {
        activate();
    }, []);

    return (
        <div>
            <h1>hi :(</h1>
            {connected.map((uuid, idx) => {
                return <h1 key={idx}>{uuid}</h1>
            })}
        </div>
    );
}

export default MainMenu;
