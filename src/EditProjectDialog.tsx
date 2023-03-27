import child_process from 'child_process';
import { basename, dirname } from 'path';
import { useRef } from 'react';
import { Button } from './components/Button';
import { Label } from './components/Label';
import { TextInput } from './components/TextInput';
import backArrowIcon from './assets/backArrow.svg';
import selectFileIcon from './assets/selectFile.svg';
import magic from './assets/magic.svg';
import { useProjectGlobalState } from './useProjectGlobalState';
import sqlite from './logic/sqlite';
import { useAsyncMemo } from './hooks/useAsyncMemo';

export function EditProjectDialog(props: { projectID: number; exitCreatingProject: () => void }) {
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
                    nameInputRef.current.value = basename(dirname(filename));
                }
            }
        });
    };

    const save = () => {
        props.exitCreatingProject();
    };

    let rows = useAsyncMemo(async () => {
        return await sqlite.query(
            `SELECT ProjectID, ProjectName, ProjectRootFilename, ProjectInfrastructure FROM Project WHERE ProjectID = :ProjectID`,
            {
                ':ProjectID': props.projectID,
            }
        );
    }, []);

    let row: any = rows && rows.length > 0 ? rows[0] : {};

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
                <TextInput
                    className="font-mono"
                    ref={nameInputRef}
                    defaultValue={row['ProjectName']}
                />
                <Label>Root File:</Label>
                <div className="w-full flex py-2">
                    <TextInput
                        className="font-mono"
                        ref={rootFileInputRef}
                        defaultValue={row['ProjectRootFilename']}
                    />
                    <Button className="flex-shrink" iconURL={selectFileIcon} onClick={pickFile}>
                        Pick File
                    </Button>
                </div>
                <Label>Infrastructure:</Label>
                <div className="w-full flex py-2">
                    <TextInput
                        className="font-mono"
                        ref={infrastructureInputRef}
                        defaultValue={row['ProjectInfrastructure']}
                    />
                    <Button iconURL={magic} onClick={autoFill}>
                        Auto Fill
                    </Button>
                </div>
                <span className="p-8" />
                <div className="w-full flex justify-around">
                    <Button onClick={save} className="mb-8" childrenClassName="px-8">
                        Save Project
                    </Button>
                    <Button
                        onClick={save}
                        className="mb-8 bg-red-600 hover:bg-red-500"
                        childrenClassName="px-8"
                    >
                        Delete Project
                    </Button>
                </div>
            </div>
        </div>
    );
}
