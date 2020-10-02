import React, {useEffect, useState} from 'react';
import { usePubNub } from 'pubnub-react';

const our_channels = ['yeah'];




function MainMenu() {
    const pubnub = usePubNub();
    const [connected, setConnected] = useState([])

    const logOut = () => {
        window.addEventListener("beforeunload", (ev) => {
            pubnub.unsubscribe({
                channels: our_channels
            })
        });
    };

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
                console.log('~~~ connected ~~~')
                console.log(occupants_list)
                console.log('~~~~~~~~~~~~~~~~~')
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
        // logOut();
        await initializeConnected();
    }

    useEffect(() => {
        // pubnub.addListener({
        //     presence: function(event) {
        //         let action = event.action;
        //         let channelName = event.channel;
        //         let occupancy = event.occupancy;
        //         let eventTimetoken = event.timetoken;
        //         let occupantUUID = event.uuid;
        //         let state = event.state;
        //         let subscribeManager = event.subscription;
        //         console.log(`accepting event of ${action} with uuid ${occupantUUID}`)
        //         if(action === 'join'){
        //             setConnected(connected => [...connected, occupantUUID]);
        //         }else if (action === 'leave'){
        //             setConnected(connected => connected.filter((uuid) => (uuid !== occupantUUID)))
        //         }
        //     }
        // });
        //
        // pubnub.subscribe({channels: our_channels, withPresence: true});
        // logOut();
        // initializeConnected();
        activate();
    }, []);

    const whoIsHere = () => {

    }


    return (
        <div>
            <h1>hi :(</h1>
            {connected.map((uuid) => {
                return <h1>{uuid}</h1>
            })}
            {/*<button onClick={whoIsHere}>click me</button>*/}
            {/*<button onClick={whereHeIs}>click me user</button>*/}
        </div>
    );
}

export default MainMenu;
