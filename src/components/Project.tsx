import playBlack from '@/assets/playBlack.svg';
import playWhite from '@/assets/playWhite.svg';
import stopBlack from '@/assets/stopBlack.svg';
import stopWhite from '@/assets/stopWhite.svg';
import settingsBlack from '@/assets/settingsBlack.svg';
import settingsWhite from '@/assets/settingsWhite.svg';
import { useDelayedState } from '@/hooks/useDelayedState';
import { Wave, WaveColor } from './Wave';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useProjectGlobalState } from '@/hooks/useProjectGlobalState';
import { ProjectsAction } from '@/ProjectsDispatch';
import { now, when } from '@/logic/now';
import sqlite from '@/logic/sqlite';

export function Project(props: {
    name: string;
    created: number;
    lastOpened: number;
    projectID: number;
    pathPreview: string;
    dispatch: React.Dispatch<ProjectsAction>;
}) {
    const [length, setLength] = useState(0);
    const [activeProjectID, setActiveProjectID] = useProjectGlobalState('projectID');
    const [, setCode] = useProjectGlobalState('code');
    const [, setFunctionName] = useProjectGlobalState('function');
    const [showAnimation, setShowAnimation] = useDelayedState(false);
    const [lastOpened, setLastOpened] = useState(props.lastOpened);
    const borderRectRef: any = useRef(null);

    let active = activeProjectID == props.projectID;

    const backgrounds: { color: WaveColor; text: string }[] = [
        { color: 'blue', text: 'white' },
        { color: 'green', text: 'white' },
        { color: 'purple', text: 'white' },
        { color: 'red', text: 'white' },
        { color: 'yellow', text: '#444444' },
    ];

    const bg = backgrounds[Math.abs(props.projectID - 1) % backgrounds.length];

    const { play, stop, settings } =
        bg.text == 'white'
            ? {
                  play: playWhite,
                  stop: stopWhite,
                  settings: settingsWhite,
              }
            : {
                  play: playBlack,
                  stop: stopBlack,
                  settings: settingsBlack,
              };

    const updateLastOpenedTime = useCallback(async () => {
        let openedTime = now();
        setLastOpened(openedTime);

        sqlite.run(
            `UPDATE Project SET ProjectLastOpened = :ProjectLastOpened WHERE ProjectID = :ProjectID`,
            {
                ':ProjectID': props.projectID,
                ':ProjectLastOpened': openedTime,
            }
        );

        sqlite.save();
    }, [setLastOpened]);

    const playStop = useCallback(() => {
        if (active) {
            setActiveProjectID(-1);
            setCode('');
        } else {
            setActiveProjectID(props.projectID);
            setCode('');
            setFunctionName('main');
            updateLastOpenedTime();
        }
    }, [activeProjectID]);

    const edit = () => props.dispatch({ type: 'edit', payload: { projectID: props.projectID } });

    useEffect(() => {
        if (active) {
            setShowAnimation(true, 0);
        } else {
            setShowAnimation(false, 300);
        }
    }, [active]);

    useLayoutEffect(() => {
        if (borderRectRef.current) {
            let perimeter = borderRectRef.current.getTotalLength();

            setLength(perimeter);
            borderRectRef.current.setAttribute('stroke-dasharray', perimeter / 8);
        }
    }, []);

    return (
        <div className="relative m-3 w-128 h-64 mb-16">
            <div className="absolute p-4 mt-8 mb-8 ml-10 w-full h-full" style={{ color: bg.text }}>
                <p className="py-2 text-xl font-bold">{props.name}</p>
                <p className="py-2">Created: {when(props.created)}</p>
                <p className="py-2">Last Opened: {when(lastOpened)}</p>
                <p className="py-2">Location: {props.pathPreview}</p>
            </div>
            <div className="absolute flex right-[-24px] bottom-0 align-center justify-right pr-[72px] select-none">
                <img
                    src={active ? stop : play}
                    width={40}
                    height={40}
                    draggable="false"
                    className="mr-[20px]"
                    onClick={playStop}
                />
                <img src={settings} width={32} height={32} draggable="false" onClick={edit} />
            </div>
            <svg
                id="visual"
                viewBox="-10 -10 532 276"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                preserveAspectRatio="none"
                width={512}
                height={304}
            >
                <rect
                    ref={borderRectRef}
                    opacity={active ? 1 : 0}
                    style={{ transition: 'opacity 0.3s ease-in-out' }}
                    x="0"
                    y="0"
                    rx="50px"
                    width="512"
                    height="256"
                    fill="transparent"
                    strokeLinecap="square"
                    stroke="white"
                    strokeWidth={16}
                    strokeDashoffset={0}
                >
                    {showAnimation && (
                        <animate
                            attributeName="stroke-dashoffset"
                            dur="10s"
                            calcMode="linear"
                            repeatCount="indefinite"
                            values={`${length};0`}
                        />
                    )}
                </rect>
                <mask id="myMask">
                    <rect x="0" y="0" width="512" height="256" rx="50" fill="white" />
                </mask>
                <g mask="url(#myMask)">
                    <Wave color={bg.color} />
                </g>
            </svg>
        </div>
    );
}
