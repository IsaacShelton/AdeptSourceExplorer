
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import './Projects.scss';
import { useDelayedState } from './useDelayedState';
import { Wave } from './Wave';

export default function Projects({ useProjectGlobalState }: any) {
    let [projectID, setProjectID] = useProjectGlobalState('projectID');

    return <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 48,
        marginBottom: 48,
        width: '100%',
        justifyContent: 'center',
    }}>
        <NewProject name="Project1" created={1235234} lastOpened={1231432} projectID={-1000} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={1} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={2} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={3} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={4} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={5} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={6} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={7} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={8} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={9} />
    </div >;
}

function choose(choices: any[]) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function Project({ name, created, lastOpened, projectID, useProjectGlobalState }: any) {
    let [length, setLength] = useState(0);
    let [activeProjectID, setActiveProjectID] = useProjectGlobalState('projectID');
    let [showAnimation, setShowAnimation] = useDelayedState(false);

    let active = activeProjectID == projectID;

    let backgrounds = [
        { color: 'blue', text: 'white' },
        { color: 'green', text: 'white' },
        { color: 'purple', text: 'white' },
        { color: 'red', text: 'white' },
        { color: 'yellow', text: '#444444' },
    ]

    let bg = backgrounds[projectID % backgrounds.length]; //choose(backgrounds);

    let playStop = useCallback(() => {
        if (activeProjectID == projectID) {
            setActiveProjectID(-1);
        } else {
            setActiveProjectID(projectID);
        }
    }, [activeProjectID]);

    useEffect(() => {
        if (activeProjectID == projectID) {
            setShowAnimation(true, 0);
        } else {
            setShowAnimation(false, 300);
        }
    }, [activeProjectID, projectID]);

    let borderRectRef: any = useRef(null);

    useLayoutEffect(() => {
        let len = borderRectRef.current.getTotalLength();
        setLength(len);
        let dasharray = len / 8;
        borderRectRef.current.setAttribute('stroke-dasharray', dasharray);
    }, []);

    return <div style={{ position: 'relative', margin: 12, width: 512, height: 256, marginBottom: 64 }}>
        <div style={{ position: 'absolute', padding: 16, marginTop: 32, marginLeft: 40, width: '100%', height: '100%', color: bg.text }}>
            <p>Name: {name}</p>
            <p>Created: {created}</p>
            <p>Last Opened: {lastOpened}</p>
            <p>GenericCardGame/main.adept</p>
        </div>
        <div style={{ position: 'absolute', right: -24, bottom: -8, display: 'flex', paddingRight: 72, alignItems: 'center', justifyContent: 'right' }}>
            {
                (bg.text == 'white') &&
                <>
                    <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                    <img src="settings-white.svg" width={32} height={32} />
                </>
            }
            {
                (bg.text != 'white') &&
                <>
                    <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                    <img src="settings-black.svg" width={32} height={32} />
                </>
            }
        </div>
        <svg id="visual" viewBox="-10 -10 532 276" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio='none' width={512} height={304}>
            <rect ref={borderRectRef} opacity={active ? 1 : 0} style={{ transition: 'opacity 0.3s ease-in-out' }} x="0" y="0" rx="50px" width="512" height="256" fill="transparent" strokeLinecap='square' stroke='white' strokeWidth={16} strokeDashoffset={0}>
                {showAnimation && <animate attributeName="stroke-dashoffset"
                    dur="10s"
                    calcMode="linear"
                    repeatCount="indefinite"
                    values={`${length};0`} />}
            </rect>
            <mask id="myMask">
                <rect x="0" y="0" width="512" height="256" rx="50" fill="white" />
            </mask>
            <g mask="url(#myMask)">
                <Wave color={bg.color} />
            </g>
        </svg>
    </div>
    //-----------

    // return <div style={{ margin: 16, padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: 'transparent', color: bg.text }}>
    //     <p>Name: {name}</p>
    //     <p>Created: {created}</p>
    //     <p>Last Opened: {lastOpened}</p>
    //     <p>GenericCardGame/main.adept</p>
    //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
    //         {
    //             (bg.text == 'white') &&
    //             <>
    //                 <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                 <img src="settings-white.svg" width={32} height={32} />
    //             </>
    //         }
    //         {
    //             (bg.text != 'white') &&
    //             <>
    //                 <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                 <img src="settings-black.svg" width={32} height={32} />
    //             </>
    //         }
    //     </div>
    // </div>

    /*
    return <div className={active ? 'animated-border animated-border-active' : 'animated-border'} style={{ margin: 16 }}>
        <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: 'transparent', color: bg.text }}>
            <p>Name: {name}</p>
            <p>Created: {created}</p>
            <p>Last Opened: {lastOpened}</p>
            <p>GenericCardGame/main.adept</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                {
                    (bg.text == 'white') &&
                    <>
                        <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                        <img src="settings-white.svg" width={32} height={32} />
                    </>
                }
                {
                    (bg.text != 'white') &&
                    <>
                        <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                        <img src="settings-black.svg" width={32} height={32} />
                    </>
                }
            </div>
        </div>
    </div>;
    */

    // return <div className={active ? 'animated-border animated-border-active' : 'animated-border'} style={{ margin: 16 }}>
    //     //{/* <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', backgroundImage: `url(./${bg.name}.svg)`, color: bg.text }}> */}
    //     <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', backgroundImage: `url(${icon})`, color: bg.text }}>
    //         <p>Name: {name}</p>
    //         <p>Created: {created}</p>
    //         <p>Last Opened: {lastOpened}</p>
    //         <p>GenericCardGame/main.adept</p>
    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
    //             {
    //                 (bg.text == 'white') &&
    //                 <>
    //                     <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                     <img src="settings-white.svg" width={32} height={32} />
    //                 </>
    //             }
    //             {
    //                 (bg.text != 'white') &&
    //                 <>
    //                     <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                     <img src="settings-black.svg" width={32} height={32} />
    //                 </>
    //             }
    //         </div>
    //     </div>
    // </div>;
}

function NewProject({ name, created, lastOpened, projectID }: any) {
    let backgrounds = [
        { name: 'wave1', text: 'white' },
        { name: 'wave2', text: 'white' },
        { name: 'wave3', text: 'white' },
        { name: 'wave4', text: 'white' },
        { name: 'wave5', text: '#444444' },
    ]

    let bg = choose(backgrounds);

    return <div style={{ cursor: 'pointer', display: 'flex', height: 296, alignItems: 'center', justifyContent: 'center', margin: 16, borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', color: bg.text }}>
        <p style={{ alignContent: 'center', justifyContent: 'center', fontSize: 60, color: '#333333' }}>+</p>
    </div>;
}
