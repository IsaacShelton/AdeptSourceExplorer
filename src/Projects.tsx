
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDelayedState } from './hooks/useDelayedState';
import { Wave } from './Wave';
import './Projects.scss';

function CreateProjectDialog(props: { cancelCreateNewProject: () => void }) {
    return <div className='w-full flex justify-center mt-20'>
        <div>
            <button className='outline-none bg-black' onClick={props.cancelCreateNewProject}>Cancel</button>
            <br />
            Name:
            <input type="text" />
            <br />
            <input type="text" />
            <button>Open File</button>
            <br />
            <button>Create Project</button>
        </div>
    </div>;
}

export default function Projects({ useProjectGlobalState }: any) {
    let [creating, setCreating] = useState(false);

    let createNewProject = useCallback(() => {
        setCreating(true);
    }, []);

    let cancelCreateNewProject = useCallback(() => {
        setCreating(false);
    }, []);

    return <div className='flex flex-wrap mt-12 mb-12 w-full justify-center'>
        {creating ?
            <CreateProjectDialog cancelCreateNewProject={cancelCreateNewProject} />
            :
            <>
                <NewProject name="Project1" created={1235234} lastOpened={1231432} projectID={-1000} onClick={createNewProject} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={1} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={2} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={3} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={4} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={5} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={6} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={7} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={8} />
                <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={9} />
            </>
        }
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

    const backgrounds = [
        { color: 'blue', text: 'white' },
        { color: 'green', text: 'white' },
        { color: 'purple', text: 'white' },
        { color: 'red', text: 'white' },
        { color: 'yellow', text: '#444444' },
    ];

    let bg = backgrounds[projectID % backgrounds.length];

    let playStop = useCallback(() => {
        setActiveProjectID(active ? -1 : projectID);
    }, [activeProjectID]);

    useEffect(() => {
        if (active) {
            setShowAnimation(true, 0);
        } else {
            setShowAnimation(false, 300);
        }
    }, [active]);

    let borderRectRef: any = useRef(null);

    useLayoutEffect(() => {
        let len = borderRectRef.current.getTotalLength();
        let dasharray = len / 8;

        setLength(len);
        borderRectRef.current.setAttribute('stroke-dasharray', dasharray);
    }, []);

    return <div className='relative m-3 w-128 h-64 mb-16'>
        <div className='absolute p-4 mt-8 mb-8 ml-10 w-full h-full' style={{ color: bg.text }}>
            <p className='py-2'>Name: {name}</p>
            <p className='py-2'>Created: {created}</p>
            <p className='py-2'>Last Opened: {lastOpened}</p>
            <p className='py-2'>GenericCardGame/main.adept</p>
        </div>
        <div className='absolute flex right-[-24px] bottom-0 align-center justify-right pr-[72px]'>
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
}

function NewProject(props: { name: string, created: number, lastOpened: number, projectID: number, onClick: () => void }) {
    return <div className='cursor-pointer flex m-4 w-[506px] h-[290px] items-center justify-center rounded-[50px] bg-[#1C1C1C]' onClick={props.onClick}>
        <p className='p-0 content-center justify-center text-[60px] text-[#333333]'>+</p>
    </div>;
}
