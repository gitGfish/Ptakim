import React, {useEffect, useState} from 'react';
import { usePubNub } from 'pubnub-react';
import Game from "./Game";

const our_channels = ['yeah'];




function MainMenu() {
    const pubnub = usePubNub();
    const [name, setName] = useState('');
    const [game_joined, setGameJoined] = useState('');
    const [showGame, setShowGame] = useState(false);


    useEffect(() => {
    }, []);

    const hostGame = async () => {
        if(name === ''){
            alert('please enter name!');
            return;
        }
        await pubnub.setUUID(name);
        let channel_name = `${name}_game`;
        await pubnub.subscribe({channels: [channel_name], withPresence: true});
        setShowGame(true);
    }

    const checkIsName = () => {
        if(name === ''){
            alert('please enter name!');
            return false;
        }
        return true;
    }

    const joinGame = () => {
        setGameJoined('Enter game id');
    }


    const joinGameWithChecking = () => {
        pubnub.hereNow(
            {
                channels: [game_joined]
            },
            function (status, response) {
                if(!checkIsName()){
                    return;
                }
                let occupants_list = response.channels[game_joined].occupants.map((occ) => {
                    return occ.uuid
                })
                if(occupants_list.length < 1) {
                    alert('This is not an active game!');
                    return;
                }
                pubnub.subscribe({channels: [game_joined], withPresence: true});
                setShowGame(true);
            }
        )
    }

    const joinGamePressed = async () => {
        joinGameWithChecking();
    }

    let comp = (
        <div>
            <input value={game_joined} onChange={(e) => {setGameJoined(e.target.value)}}/>
            <button onClick={joinGamePressed}>JOIN</button>
        </div>
    )

    return (
        <div>
            {showGame ? (<Game channel={game_joined? (game_joined) : (`${name}_game`)}/>) : (
                <div style={{display: 'flex', flexDirection:'column' ,justifyContent: 'center', alignItems:'space-between', minHeight: 250, minWidth: 250,border:'solid'}}>
                    <div style={{display: 'flex', flexDirection:'row', flexGrow:0, justifyContent:'center'}}>
                        <h3>Enter your name -> </h3>
                        <input value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <button style={{flexGrow: 0}} onClick={hostGame}>Host</button>
                    <button onClick={joinGame}>Join</button>
                    {game_joined ? (comp) : null}
                </div>
            )}
        </div>

    );
}

export default MainMenu;
