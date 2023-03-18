import WaveBackground from "./WaveBackground";

export default function Projects() {
    return <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 48,
        marginBottom: 48,
        width: '100%',
        justifyContent: 'center',
    }}>
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
        <Project name="Project1" created={1235234} lastOpened={1231432} projectID={1432} />
    </div >;
}

function choose(choices: any[]) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function Project({ name, created, lastOpened, projectID }: any) {
    let backgrounds = [
        { name: 'wave1', text: 'white' },
        { name: 'wave2', text: 'white' },
        { name: 'wave3', text: 'white' },
        { name: 'wave4', text: 'white' },
        { name: 'wave5', text: '#444444' },
    ]

    let bg = choose(backgrounds);

    return <div style={{ padding: 40, justifyContent: 'center', margin: 16, borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', backgroundImage: `url(./${bg.name}.svg)`, color: bg.text }}>
        <p>Name: {name}</p>
        <p>Created: {created}</p>
        <p>Last Opened: {lastOpened}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            {
                (bg.text == 'white') &&
                <>
                    <img src="play-white.svg" width={40} height={40} style={{ marginRight: 20 }} />
                    <img src="settings-white.svg" width={32} height={32} />
                </>
            }
            {
                (bg.text != 'white') &&
                <>
                    <img src="play-black.svg" width={40} height={40} style={{ marginRight: 20 }} />
                    <img src="settings-black.svg" width={32} height={32} />
                </>
            }
        </div>
    </div>;
}
