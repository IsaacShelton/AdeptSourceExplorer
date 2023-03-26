
import { ForwardedRef, InputHTMLAttributes, ReactNode, RefObject, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useDelayedState } from './hooks/useDelayedState';
import { Wave } from './Wave';
import './Projects.scss';
import backArrowIcon from './assets/backArrow.svg';
import selectFileIcon from './assets/selectFile.svg';
import child_process from 'child_process';

import playBlack from './assets/playBlack.svg'
import playWhite from './assets/playWhite.svg'
import stopBlack from './assets/stopBlack.svg'
import stopWhite from './assets/stopWhite.svg'
import settingsBlack from './assets/settingsBlack.svg'
import settingsWhite from './assets/settingsWhite.svg'
import magic from './assets/magic.svg';
import { Button } from './Button';
import React from 'react';

const TextInput = React.forwardRef((props: InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement | null>) => {
    let { className, ...restProps } = props;
    return <input type="text" className={`flex-grow outline-none bg-[#202020] p-4 outline-offset-0 ${className}`} ref={ref} {...restProps} />;
});

const Label = (props: { children?: ReactNode }) => {
    return <p className='py-2 text-lg'>{props.children}</p>;
};

function CreateProjectDialog(props: { cancelCreateNewProject: () => void }) {
    const autoFill = () => {
        child_process.exec("adept --root", (err: any, stdout, stderr) => {
            if (infrastructureTextInputRef.current == null) return;

            if (err.code > 1) {
                infrastructureTextInputRef.current.value = 'Error: No Adept compiler in path';
            } else {
                infrastructureTextInputRef.current.value = stdout.trim();
            }
        });
    };

    let infrastructureTextInputRef = useRef<HTMLInputElement>(null);

    return <div className='w-3/4 flex justify-center mt-20'>
        <div className='w-full flex flex-col align-center'>
            <Button onClick={props.cancelCreateNewProject} iconURL={backArrowIcon} noIconShift>
                Back
            </Button>
            <span className='p-4' />
            <Label>Name:</Label>
            <TextInput className='font-mono' />
            <Label>Root File:</Label>
            <div className='w-full flex py-2'>
                <TextInput className='font-mono' />
                <Button className='flex-shrink' iconURL={selectFileIcon}>Pick File</Button>
            </div>
            <Label>Infrastructure:</Label>
            <div className='w-full flex py-2'>
                <TextInput className='font-mono' ref={infrastructureTextInputRef} />
                <Button iconURL={magic} onClick={autoFill}>Auto Fill</Button>
            </div>
            <span className='p-4' />
            <Button>Create Project</Button>
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

    let { play, stop, settings } = bg.text == 'white' ? {
        play: playWhite,
        stop: stopWhite,
        settings: settingsWhite,
    } : {
        play: playBlack,
        stop: stopBlack,
        settings: settingsBlack,
    };

    return <div className='relative m-3 w-128 h-64 mb-16'>
        <div className='absolute p-4 mt-8 mb-8 ml-10 w-full h-full' style={{ color: bg.text }}>
            <p className='py-2'>Name: {name}</p>
            <p className='py-2'>Created: {created}</p>
            <p className='py-2'>Last Opened: {lastOpened}</p>
            <p className='py-2'>GenericCardGame/main.adept</p>
        </div>
        <div className='absolute flex right-[-24px] bottom-0 align-center justify-right pr-[72px] select-none'>
            <img src={active ? stop : play} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
            <img src={settings} width={32} height={32} />
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
        <p className='p-0 select-none content-center justify-center text-[60px] text-[#333333]'>+</p>
    </div>;
}
