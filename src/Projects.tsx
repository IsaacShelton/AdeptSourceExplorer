import { useCallback, useRef, useState } from 'react';
import backArrowIcon from './assets/backArrow.svg';
import selectFileIcon from './assets/selectFile.svg';
import child_process from 'child_process';
import magic from './assets/magic.svg';
import { Button } from './components/Button';
import path, { basename, dirname } from 'path';
import { createProject } from './logic/createProject';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import sqlite from './logic/sqlite';
import { Project } from './components/Project';
import { NewProject } from './components/NewProject';
import { Label } from './components/Label';
import { TextInput } from './components/TextInput';

function CreateProjectDialog(props: {
    exitCreatingProject: () => void;
    useProjectGlobalState: any;
}) {
    let { useProjectGlobalState } = props;
    let [_, setActiveProjectID] = useProjectGlobalState('projectID');

    const autoFill = () => {
        child_process.exec(
            'adept --root',
            (err: child_process.ExecException | null, stdout: string, _) => {
                if (infrastructureInputRef.current == null) return;

                if (err && err.code && err.code > 1) {
                    infrastructureInputRef.current.value = 'Error: No Adept compiler in path';
                } else {
                    infrastructureInputRef.current.value = stdout.trim();
                }
            }
        );
    };

    const pickFile = () => {
        (window as any).electronAPI.openFile().then((filename: string | null) => {
            if (filename && rootFileInputRef.current) {
                rootFileInputRef.current.value = filename;

                if (nameInputRef.current && nameInputRef.current.value == '') {
                    nameInputRef.current.value = path.basename(path.dirname(filename));
                }
            }
        });
    };

    const create = () => {
        if (
            nameInputRef.current == null ||
            rootFileInputRef.current == null ||
            infrastructureInputRef.current == null
        )
            return;

        let name = nameInputRef.current.value;
        let filename = rootFileInputRef.current.value;
        let infrastructure = infrastructureInputRef.current.value;

        createProject(name, filename, infrastructure).then((newProjectID) => {
            props.exitCreatingProject();
            setActiveProjectID(newProjectID);
        });
    };

    let infrastructureInputRef = useRef<HTMLInputElement>(null);
    let rootFileInputRef = useRef<HTMLInputElement>(null);
    let nameInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="w-3/4 flex justify-center mt-20">
            <div className="w-full flex flex-col align-center">
                <Button onClick={props.exitCreatingProject} iconURL={backArrowIcon} noIconShift>
                    Back
                </Button>
                <span className="p-4" />
                <Label>Name:</Label>
                <TextInput className="font-mono" ref={nameInputRef} />
                <Label>Root File:</Label>
                <div className="w-full flex py-2">
                    <TextInput className="font-mono" ref={rootFileInputRef} />
                    <Button className="flex-shrink" iconURL={selectFileIcon} onClick={pickFile}>
                        Pick File
                    </Button>
                </div>
                <Label>Infrastructure:</Label>
                <div className="w-full flex py-2">
                    <TextInput className="font-mono" ref={infrastructureInputRef} />
                    <Button iconURL={magic} onClick={autoFill}>
                        Auto Fill
                    </Button>
                </div>
                <span className="p-4" />
                <Button onClick={create} className="mb-8">
                    Create Project
                </Button>
            </div>
        </div>
    );
}

export default function Projects({ useProjectGlobalState }: any) {
    let [creating, setCreating] = useState(false);

    let startCreatingProject = useCallback(() => {
        setCreating(true);
    }, []);

    let exitCreatingProject = useCallback(() => {
        setCreating(false);
    }, []);

    let rows = useAsyncMemo(async () => {
        return sqlite.query(
            `SELECT ProjectID, ProjectName, ProjectRootFilename, ProjectInfrastructure FROM Project`
        );
    }, [creating]);

    if (creating) {
        return (
            <div className="absolute flex m-0 p-0 w-full h-auto justify-center">
                <CreateProjectDialog
                    exitCreatingProject={exitCreatingProject}
                    useProjectGlobalState={useProjectGlobalState}
                />
            </div>
        );
    } else if (rows == null || rows.length == 0) {
        return (
            <div className="absolute flex m-0 p-0 w-full h-full">
                <div className="flex flex-wrap w-full h-full justify-center content-center">
                    <NewProject onClick={startCreatingProject} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="absolute flex flex-wrap mt-12 mb-12 w-full justify-center">
                <NewProject onClick={startCreatingProject} />
                {rows?.map(
                    ({
                        ProjectID: projectID,
                        ProjectName: projectName,
                        ProjectRootFilename: rootFilename,
                    }: any) => {
                        let pathPreview =
                            basename(dirname(rootFilename)) + path.sep + basename(rootFilename);

                        return (
                            <Project
                                useProjectGlobalState={useProjectGlobalState}
                                name={projectName}
                                created={1235234}
                                lastOpened={1231432}
                                key={projectID}
                                projectID={projectID}
                                pathPreview={pathPreview}
                            />
                        );
                    }
                )}
            </div>
        );
    }
}
