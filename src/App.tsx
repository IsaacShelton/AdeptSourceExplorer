import { useEffect, useState } from 'react';
import TabGroup from './TabGroup';
import { setupDatabase } from './logic/setupDatabase';

function App() {
    let [waitingForConnection, setWaitingForConnection] = useState(true);

    useEffect(() => {
        setupDatabase().then(() => {
            setWaitingForConnection(false);
        });
    }, []);

    return waitingForConnection ? <div></div> : <TabGroup />;
}

export default App;
