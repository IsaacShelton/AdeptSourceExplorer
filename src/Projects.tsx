
import { ForwardedRef, InputHTMLAttributes, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import path from 'path';
import { createProject } from './createProject';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import sqlite from './sqlite';

const TextInput = React.forwardRef((props: InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement | null>) => {
    let { className, ...restProps } = props;
    return <input type="text" className={`flex-grow outline-none bg-[#202020] p-4 outline-offset-0 ${className}`} ref={ref} spellCheck="false" {...restProps} />;
});

const Label = (props: { children?: ReactNode }) => {
    return <p className='py-2 text-lg'>{props.children}</p>;
};

function CreateProjectDialog(props: { cancelCreateNewProject: () => void, useProjectGlobalState: any }) {
    let { useProjectGlobalState } = props;
    let [_, setActiveProjectID] = useProjectGlobalState('projectID');

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

    const pickFile = () => {
        (window as any).electronAPI.openFile().then((filename: string | null) => {
            if (filename && rootFileTextInputRef.current) {
                rootFileTextInputRef.current.value = filename;

                if (nameTextInputRef.current && nameTextInputRef.current.value == '') {
                    nameTextInputRef.current.value = path.basename(path.dirname(filename));
                }
            }
        });
    };

    const create = () => {
        if (nameTextInputRef.current == null || rootFileTextInputRef.current == null || infrastructureTextInputRef.current == null) return;

        let name = nameTextInputRef.current.value;
        let filename = rootFileTextInputRef.current.value;
        let infrastructure = infrastructureTextInputRef.current.value;

        createProject(name, filename, infrastructure).then((newProjectID) => {
            props.cancelCreateNewProject();
            setActiveProjectID(newProjectID);
        });
    };

    let infrastructureTextInputRef = useRef<HTMLInputElement>(null);
    let rootFileTextInputRef = useRef<HTMLInputElement>(null);
    let nameTextInputRef = useRef<HTMLInputElement>(null);

    return <div className='w-3/4 flex justify-center mt-20'>
        <div className='w-full flex flex-col align-center'>
            <Button onClick={props.cancelCreateNewProject} iconURL={backArrowIcon} noIconShift>
                Back
            </Button>
            <span className='p-4' />
            <Label>Name:</Label>
            <TextInput className='font-mono' ref={nameTextInputRef} />
            <Label>Root File:</Label>
            <div className='w-full flex py-2'>
                <TextInput className='font-mono' ref={rootFileTextInputRef} />
                <Button className='flex-shrink' iconURL={selectFileIcon} onClick={pickFile}>Pick File</Button>
            </div>
            <Label>Infrastructure:</Label>
            <div className='w-full flex py-2'>
                <TextInput className='font-mono' ref={infrastructureTextInputRef} />
                <Button iconURL={magic} onClick={autoFill}>Auto Fill</Button>
            </div>
            <span className='p-4' />
            <Button onClick={create} className='mb-8'>Create Project</Button>
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

    let rows = useAsyncMemo(async () => {
        return sqlite.query(`SELECT ProjectID, ProjectName, ProjectRootFilename, ProjectInfrastructure FROM Project`);
    }, [creating]);

    if (creating) {
        return <div className='absolute flex m-0 p-0 w-full h-auto justify-center'>
            <CreateProjectDialog cancelCreateNewProject={cancelCreateNewProject} useProjectGlobalState={useProjectGlobalState} />
        </div>
    } else if (rows == null || rows.length == 0) {
        return <div className='absolute flex m-0 p-0 w-full h-full'>
            <div className='flex flex-wrap w-full h-full justify-center content-center'>
                <NewProject name="Project1" created={1235234} lastOpened={1231432} projectID={-1000} onClick={createNewProject} />
            </div>;
        </div>
    } else {
        return <div className='absolute flex flex-wrap mt-12 mb-12 w-full justify-center'>
            <NewProject name="Project1" created={1235234} lastOpened={1231432} projectID={-1000} onClick={createNewProject} />

            {
                rows?.map((row: any) => (
                    <Project
                        useProjectGlobalState={useProjectGlobalState}
                        name={row['ProjectName']}
                        created={1235234}
                        lastOpened={1231432}
                        key={row['ProjectID']}
                        projectID={row['ProjectID']}
                        pathPreview={path.basename(path.dirname(row['ProjectRootFilename'])) + path.sep + path.basename(row['ProjectRootFilename'])} />
                ))
            }
        </div>
    }
}

function Project({ name, created, lastOpened, projectID, useProjectGlobalState, pathPreview }: any) {
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

    let bg = backgrounds[Math.abs(projectID - 1) % backgrounds.length];

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
            <p className='py-2'>{pathPreview}</p>
        </div>
        <div className='absolute flex right-[-24px] bottom-0 align-center justify-right pr-[72px] select-none'>
            <img src={active ? stop : play} width={40} height={40} draggable="false" className='mr-[20px]' onClick={playStop} />
            <img src={settings} width={32} height={32} draggable="false" />
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
