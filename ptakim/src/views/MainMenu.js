import React, {useEffect, useState} from 'react';
import { usePubNub } from 'pubnub-react';

const our_channels = ['yeah'];




function MainMenu() {
    const pubnub = usePubNub();
    const [connected, setConnected] = useState([])
    const [name, setName] = useState('');
    const [game_joined, setGameJoined] = useState('');

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
        // await pubnub.addListener({
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
        //         }else if (action === 'leave' || action === 'timeout'){
        //             setConnected(connected => connected.filter((uuid) => (uuid !== occupantUUID)))
        //         }
        //     }
        // });
        // await pubnub.subscribe({channels: our_channels, withPresence: true});
        // await initializeConnected();
    }

    useEffect(() => {
        activate();
    }, []);

    const hostGame = async () => {
        await pubnub.setUUID(name);
        let channel_name = `${name}_game`;
        await pubnub.subscribe({channels: [channel_name], withPresence: true});
        alert(`hosted ${channel_name} successfully!`);
    }

    const joinGame = () => {
        setGameJoined('Enter game id');
    }


    const check = () => {
        pubnub.hereNow(
            {
                channels: [game_joined]
            },
            function (status, response) {
                let occupants_list = response.channels[game_joined].occupants.map((occ) => {
                    return occ.uuid
                })
                console.log(occupants_list)
            }
        )
    }

    const joinGamePressed = async () => {
        await pubnub.setUUID(name);
        await pubnub.subscribe({channels: [game_joined], withPresence: true});
        await pubnub.hereNow(
            {
                channels: [game_joined]
            },
            function (status, response) {
                let occupants_list = response.channels[game_joined].occupants.map((occ) => {
                    return occ.uuid
                })
                console.log(occupants_list)
            }
        );
        // alert(`joiend ${game_joined} successfully!`);
    }

    let comp = (
        <div>
            <input value={game_joined} onChange={(e) => {setGameJoined(e.target.value)}}/>
            <button onClick={joinGamePressed}>JOIN</button>
        </div>

    )

    return (
        <div style={{display: 'flex', flexDirection:'column' ,justifyContent: 'center', alignItems:'space-between', minHeight: 250, minWidth: 250,border:'solid'}}>
            <div style={{display: 'flex', flexDirection:'row', flexGrow:0, justifyContent:'center'}}>
                <h3>Enter your name -> </h3>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <button style={{flexGrow: 0}} onClick={hostGame}>Host</button>
            <button onClick={joinGame}>Join</button>
            {game_joined ? (comp) : null}
            <button onClick={check}>CHECK</button>
        </div>
    );
}

export default MainMenu;
