import playBlack from '@/assets/playBlack.svg';
import playWhite from '@/assets/playWhite.svg';
import stopBlack from '@/assets/stopBlack.svg';
import stopWhite from '@/assets/stopWhite.svg';
import settingsBlack from '@/assets/settingsBlack.svg';
import settingsWhite from '@/assets/settingsWhite.svg';
import { useDelayedState } from '@/hooks/useDelayedState';
import { Wave, WaveColor } from './Wave';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export function Project({
    name,
    created,
    lastOpened,
    projectID,
    useProjectGlobalState,
    pathPreview,
}: any) {
    let [length, setLength] = useState(0);
    let [activeProjectID, setActiveProjectID] = useProjectGlobalState('projectID');
    let [showAnimation, setShowAnimation] = useDelayedState(false);

    let active = activeProjectID == projectID;

    const backgrounds: { color: WaveColor; text: string }[] = [
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

    let { play, stop, settings } =
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

    return (
        <div className="relative m-3 w-128 h-64 mb-16">
            <div className="absolute p-4 mt-8 mb-8 ml-10 w-full h-full" style={{ color: bg.text }}>
                <p className="py-2">Name: {name}</p>
                <p className="py-2">Created: {created}</p>
                <p className="py-2">Last Opened: {lastOpened}</p>
                <p className="py-2">{pathPreview}</p>
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
                <img src={settings} width={32} height={32} draggable="false" />
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
