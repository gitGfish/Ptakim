import React, {useEffect, useState} from 'react';
import { usePubNub } from 'pubnub-react';
import Game from "./Game";
import {Redirect} from "react-router-dom";



const global_active_games_channel = 'global_active_games_channel';

function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function MainMenu() {
    const pubnub = usePubNub();
    const [name, setName] = useState('');
    const [is_joining_game, setJoiningGame] = useState(false);
    const [joining_game_id, setJoiningGameId] = useState('please enter game id');
    const [goto_lobby, setGotoLobby] = useState(false);
    const [game_id, setGameId] = useState('');

    useEffect(() => {
    }, []);

    const setUserMetadata = (host) => {
        pubnub.objects.setUUIDMetadata({
            data: {
                name: name,
                custom: {
                    host: host
                }
            }
        });
    }

    const hostGame = async () => {
        if(name === ''){
            alert('please enter name!');
            return;
        }
        let i;
        let game_id = 'null';
        let channel_name;
        for(i = 0; i < 3; i++){
            let tmp_game_id = makeid(5)
            let tmp_channel_name = `${tmp_game_id}_game`;
            let channel_status = await pubnub.hereNow(
                {
                    channels: [tmp_channel_name]
                }
            )
            let occupancy = channel_status.totalOccupancy
            if(occupancy === 0){
                game_id = tmp_game_id;
                channel_name = tmp_channel_name;
                break;
            }
        }
        if(game_id === 'null'){
            alert('cant host game!!');
            return;
        }
        setGameId(game_id);
        await pubnub.subscribe({channels: [channel_name], withPresence: true});
        await setUserMetadata(true);
        setGotoLobby(true);
        // alert(`Game id is ${game_id}`);
    }

    const joinGameClicked = () => {
        setJoiningGame(true);
    }

    const joinGame = async () => {
        if(name === ''){
            alert('please enter name!');
            return;
        }
        let channel_name = `${joining_game_id}_game`;
        let channel_status = await pubnub.hereNow(
            {
                channels: [channel_name]
            }
        )
        let occupancy = channel_status.totalOccupancy
        if(occupancy === 0){
            alert('Not an active game! please enter different code!');
            return;
        }
        await pubnub.subscribe({channels: [channel_name], withPresence: true});
        await setUserMetadata(false);
        setGotoLobby(true);
    }

    let comp = (
        <div>
            <input value={joining_game_id} onChange={(e) => {setJoiningGameId(e.target.value)}}/>
            <button onClick={joinGame}>JOIN</button>
        </div>
    )

    return (
        <div style={{display: 'flex', flexDirection:'column' ,justifyContent: 'center', alignItems:'space-between', minHeight: 250, minWidth: 250,border:'solid'}}>
            <div style={{display: 'flex', flexDirection:'row', flexGrow:0, justifyContent:'center'}}>
                <h3>Enter your name -> </h3>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <button style={{flexGrow: 0}} onClick={hostGame}>Host</button>
            <button onClick={joinGameClicked}>Join</button>
            {is_joining_game ? (comp) : null}
            {goto_lobby ? (<Redirect push to="lobby"/>) : null}
        </div>
    );
}

export default MainMenu;
