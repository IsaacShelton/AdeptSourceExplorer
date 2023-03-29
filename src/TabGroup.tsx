import { ReactNode, useState } from 'react';
import CallDistribution from './CallDistribution';
import { ConnectionGraph } from './ConnectionGraph';
import OverviewFlow from './OverviewFlow';
import Projects from './Projects';
import { useProjectGlobalState } from './hooks/useProjectGlobalState';

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

const tabNames = ['Project', 'Function View', 'Call Distribution', 'Connection Graph'];

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
        default:
            return <></>;
    }
};

export default function TabGroup() {
    const [active, setActive] = useState(tabNames[0]);
    const [projectID] = useProjectGlobalState('projectID');

    let viewableTabNames: any[] = projectID < 0 ? tabNames.slice(0, 1) : tabNames;

    return (
        <>
            {TabContent(active)}

            <div className="fixed top-0 flex m-0 p-0 w-full">
                <ButtonGroup>
                    {viewableTabNames.map(type => (
                        <Tab key={type} active={active === type} onClick={() => setActive(type)}>
                            {type}
                        </Tab>
                    ))}
                </ButtonGroup>
            </div>
        </>
    );
}
