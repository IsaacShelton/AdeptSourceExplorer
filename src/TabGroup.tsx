import { ReactNode, useEffect, useRef } from 'react';
import CallDistribution from './CallDistribution';
import { ConnectionGraph } from './ConnectionGraph';
import OverviewFlow from './OverviewFlow';
import Projects from './Projects';
import { useProjectGlobalState } from './hooks/useProjectGlobalState';
import { CodeViewer } from './CodeViewer';
import sqlite from './logic/sqlite';
import CancelablePromise, { cancelable } from 'cancelable-promise';

const Tab = (props: { active: boolean; children?: ReactNode; onClick: () => any }) => {
    let style = props.active
        ? { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px' }
        : undefined;

    return (
        <button
            onClick={props.onClick}
            style={style}
            className="whitespace-nowrap select-none text-[20px] py-[10px] px-[60px] mx-1 border-none
        cursor-pointer bg-transparent font-sans lowercase text-white pt-[4px]
        transition-background-color duration-100 ease-in rounded-[20px] outline-none"
        >
            {props.children}
        </button>
    );
};

const ButtonGroup = (props: { children?: ReactNode }) => {
    return (
        <div className="flex justify-left h-10 w-full absolute bg-[#303030]">{props.children}</div>
    );
};

const tabNames = ['Project', 'Function View', 'Call Distribution', 'Connection Graph', 'Code'];

const TabContent = (kind: string) => {
    switch (kind) {
        case 'Project':
            return <Projects />;
        case 'Function View':
            return <OverviewFlow />;
        case 'Call Distribution':
            return <CallDistribution />;
        case 'Connection Graph':
            return <ConnectionGraph />;
        case 'Code':
            return <CodeViewer />;
        default:
            return <></>;
    }
};

export default function TabGroup() {
    const [active, setActive] = useProjectGlobalState('tab');
    const [projectID] = useProjectGlobalState('projectID');
    const [code] = useProjectGlobalState('code');

    let waitingOn = useRef({ titlePromise: null as CancelablePromise<any[]> | null });

    // Update title to include project name when a project is active.
    useEffect(() => {
        if (waitingOn.current.titlePromise != null) {
            waitingOn.current.titlePromise.cancel();
        }

        if (projectID >= 0) {
            waitingOn.current.titlePromise = cancelable(
                sqlite.query(`SELECT ProjectName FROM Project WHERE ProjectID = :ProjectID`, {
                    ':ProjectID': projectID,
                })
            );

            waitingOn.current.titlePromise.then(rows => {
                if (rows.length > 0) {
                    let projectName = rows[0]['ProjectName'];
                    document.title = `Adept Source Explorer - [${projectName}]`;
                }
            });
        } else {
            document.title = `Adept Source Explorer`;
        }
    }, [projectID]);

    let viewableTabNames: string[] = projectID < 0 ? tabNames.slice(0, 1) : tabNames;

    return (
        <>
            {TabContent(active)}

            <div className="fixed top-0 flex m-0 p-0 w-full">
                <ButtonGroup>
                    {viewableTabNames.map(
                        type =>
                            !(type == 'Code' && code === '') && (
                                <Tab
                                    key={type}
                                    active={active === type}
                                    onClick={() => setActive(type)}
                                >
                                    {type}
                                </Tab>
                            )
                    )}
                </ButtonGroup>
            </div>
        </>
    );
}
