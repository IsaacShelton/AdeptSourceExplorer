
import { useCallback } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import './Projects.scss';

const { useGlobalState } = createGlobalState({ projectID: -1 });

export default function Projects() {
    let [projectID, setProjectID] = useGlobalState('projectID');

    return <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 48,
        marginBottom: 48,
        width: '100%',
        justifyContent: 'center',
    }}>
        <NewProject name="Project1" created={1235234} lastOpened={1231432} projectID={-1000} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1} active={1 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={2} active={2 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={3} active={3 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={4} active={4 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={5} active={5 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={6} active={6 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={7} active={7 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={8} active={8 == projectID} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={9} active={9 == projectID} />
    </div >;
}

function choose(choices: any[]) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function Project({ name, created, lastOpened, projectID, active }: any) {
    let [activeProjectID, setActiveProjectID] = useGlobalState('projectID');

    let backgrounds = [
        { name: 'wave1', text: 'white' },
        { name: 'wave2', text: 'white' },
        { name: 'wave3', text: 'white' },
        { name: 'wave4', text: 'white' },
        { name: 'wave5', text: '#444444' },
    ]

    let bg = backgrounds[projectID % backgrounds.length]; //choose(backgrounds);

    let playStop = useCallback(() => {
        if (activeProjectID == projectID) {
            setActiveProjectID(-1);
        } else {
            setActiveProjectID(projectID);
        }
    }, [activeProjectID]);

    return <div className={active ? 'animated-border animated-border-active' : 'animated-border'} style={{ margin: 16 }}>
        <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', backgroundImage: `url(./${bg.name}.svg)`, color: bg.text }}>
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
