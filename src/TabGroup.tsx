
import { useState } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import CallDistribution from './CallDistribution';
import { ConnectionGraph } from './ConnectionGraph';
import OverviewFlow from './OverviewFlow';
import Projects from './Projects';

const Tab = (props: { active: boolean, children: any[], onClick: () => any }) => {
    let style = props.active ? { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px' } : undefined;

    return <button
        onClick={props.onClick}
        style={style}
        className='whitespace-nowrap select-none text-[20px] py-[10px] px-[60px] mx-1 border-none
        cursor-pointer bg-transparent font-sans lowercase text-white pt-[4px]
        transition-background-color duration-100 ease-in rounded-[20px]'>
        {...props.children}
    </button>
};

const ButtonGroup = (props: { children: any[] }) => {
    return <div className='flex justify-left h-10 w-full absolute bg-[#303030]'>
        {...props.children}
    </div>
};

const tabNames = ['Project', 'Function View', 'Call Distribution', 'Connection Graph'];
const { useGlobalState: useProjectGlobalState } = createGlobalState({ projectID: -1 });

const TabContent = (kind: string) => {
    switch (kind) {
        case 'Project':
            return <Projects useProjectGlobalState={useProjectGlobalState} />;
        case 'Function View':
            return <OverviewFlow useProjectGlobalState={useProjectGlobalState} />;
        case 'Call Distribution':
            return <CallDistribution useProjectGlobalState={useProjectGlobalState} />;
        case 'Connection Graph':
            return <ConnectionGraph useProjectGlobalState={useProjectGlobalState} />;
        default:
            return <></>;
    }
}

export default function TabGroup() {
    const [active, setActive] = useState(tabNames[0]);
    const [projectID] = useProjectGlobalState('projectID');

    let viewableTabNames: any[] = projectID < 0 ? tabNames.slice(0, 1) : tabNames;

    return (
        <div className='absolute flex m-0 p-0 w-full' style={{
            height: (active == 'Project' ? 'auto' : '100%')
        }} >

            {TabContent(active)}

            <ButtonGroup>
                {viewableTabNames.map(type => (
                    <Tab
                        key={type}
                        // @ts-ignore
                        active={active === type}
                        onClick={() => setActive(type)}
                    >
                        {type}
                    </Tab>
                ))}
            </ButtonGroup>
        </div >
    );
}