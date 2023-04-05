import { Button } from './components/Button';
import backArrowIcon from './assets/backArrow.svg';
import { useProjectGlobalState } from './hooks/useProjectGlobalState';
import sqlite from './logic/sqlite';
import { setupDatabase } from './logic/setupDatabase';
import githubIcon from './assets/github.svg';
import { useCallback } from 'react';
import { shell } from 'electron';

export function AllSettingsDialog(props: { back: () => void }) {
    let [, setActiveProjectID] = useProjectGlobalState('projectID');
    let [, setCode] = useProjectGlobalState('code');

    const reset = () => {
        (async () => {
            await sqlite.run('DROP TABLE IF EXISTS Project');
            await sqlite.run('DROP TABLE IF EXISTS Function');
            await sqlite.run('DROP TABLE IF EXISTS Composite');
            await sqlite.run('DROP TABLE IF EXISTS Call');
            await setupDatabase();
            await sqlite.save();
        })().then(() => {
            setActiveProjectID(-1);
            setCode('');
            props.back();
        });
    };

    const showGithubPage = useCallback(() => {
        shell.openExternal('https://github.com/IsaacShelton/AdeptSourceExplorer');
    }, []);

    return (
        <div className="w-3/4 flex justify-center mt-20">
            <div className="w-full flex flex-col align-center">
                <Button onClick={props.back} iconURL={backArrowIcon} noIconShift>
                    Back
                </Button>
                <span className="p-6" />
                <div className="bg-[#202020] w-fit mx-auto rounded-3xl px-24 py-4">
                    <p className="text-center p-4 font-bold text-xl">Adept Source Explorer</p>
                    <p className="text-center p-4">version 0.0.1</p>
                    <p className="text-center p-4">(c) 2023 Isaac Shelton</p>
                    <p className="text-center p-4">MIT License</p>
                </div>
                <span className="p-4" />
                <div className="w-full flex justify-around">
                    <Button
                        onClick={showGithubPage}
                        iconURL={githubIcon}
                        className="mb-8 w-72"
                        childrenClassName=""
                        noIconShift
                    >
                        GitHub
                    </Button>
                </div>
                <div className="w-full flex justify-around">
                    <Button
                        onClick={reset}
                        className="mb-8 bg-red-900 hover:bg-red-800 w-72"
                        childrenClassName=""
                        noIconShift
                    >
                        Reset Entire Database
                    </Button>
                </div>
            </div>
        </div>
    );
}
