import { Suspense, useLayoutEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import './App.scss'
import OverviewFlow from './OverviewFlow';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}

function App() {
    const [count, setCount] = useState(0)
    const [width, height] = useWindowSize();

    return (
        <Suspense fallback={<BarLoader />}>
            <div style={{ width, height }}>
                <OverviewFlow />
            </div>
        </Suspense>
    );
}

export default App;
