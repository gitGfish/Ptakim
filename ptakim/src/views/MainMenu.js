import React, {useEffect} from 'react';
import { usePubNub } from 'pubnub-react';

const channels = ['yeah'];


function MainMenu() {
    const pubnub = usePubNub();

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
                console.log(event);
                console.log(action);
            }
        });
        await pubnub.subscribe({channels: channels});
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
        //         console.log(event);
        //         console.log(action);
        //     }
        // });
        //
        // pubnub.subscribe({channels: channels});
        activate();
    }, []);

    const whoIsHere = () => {
        pubnub.hereNow(
            {
                channels: channels,
                includeState: true
            },
            function (status, response) {
                console.log(status, response);
            }
        );
    }

    const whereHeIs = () => {
        pubnub.whereNow({uuid: pubnub.uuid},
            function (status, response) {
                console.log(status, response);
            }
        );
    }

    return (
        <div>
            <h1>hi :(</h1>
            <button onClick={whoIsHere}>click me</button>
            <button onClick={whereHeIs}>click me user</button>
        </div>
    );
}

export default MainMenu;
