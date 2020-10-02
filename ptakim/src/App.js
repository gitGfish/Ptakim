import React from 'react';
import MainMenu from "./views/MainMenu";
import PubNub from 'pubnub';
import { PubNubProvider} from 'pubnub-react';

const pubnub = new PubNub({
    publishKey: 'pub-c-c2d54f38-8db8-44b8-8065-59f3587affd8',
    subscribeKey: 'sub-c-70cd517e-001e-11eb-ae2d-56dc81df9fb5',
    // uuid: 'sean the man',
    presenceTimeout: 20,
});



function App() {
  return (
    <PubNubProvider client={pubnub}>
      <MainMenu/>
    </PubNubProvider>
  );
}

export default App;
