import React, {useEffect} from 'react';
import MainMenu from "./views/MainMenu";
import PubNub from 'pubnub';
import { PubNubProvider} from 'pubnub-react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Lobby from "./views/Lobby";
import Game from "./views/Game";


const pubnub = new PubNub({
    publishKey: 'pub-c-c2d54f38-8db8-44b8-8065-59f3587affd8',
    subscribeKey: 'sub-c-70cd517e-001e-11eb-ae2d-56dc81df9fb5',
    presenceTimeout: 20,
});



function App() {

    useEffect(() => {
        localStorage.clear();
    }, []);


  return (
      <Router>
          <PubNubProvider client={pubnub}>
              {/* A <Switch> looks through its children <Route>s and
               renders the first one that matches the current URL. */}
              <Switch>
                  <Route path={'/lobby'}>
                      <Lobby/>
                  </Route>
                  <Route path={'/Game'}>
                      <Game/>
                  </Route>
                  <Route path={'/'}>
                      <MainMenu/>
                  </Route>
              </Switch>
          </PubNubProvider>
      </Router>
  );
}

export default App;
