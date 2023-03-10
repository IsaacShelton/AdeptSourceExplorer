
import './App.scss'
import TabGroup from './TabGroup';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
    return (
        <TabGroup />
    );
}

export default App;
