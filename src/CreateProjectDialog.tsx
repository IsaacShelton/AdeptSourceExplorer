import child_process from 'child_process';
import { basename, dirname } from 'path';
import { useCallback, useRef } from 'react';
import { Button } from './components/Button';
import { Label } from './components/Label';
import { TextInput } from './components/TextInput';
import { createProject } from './logic/createProject';
import backArrowIcon from './assets/backArrow.svg';
import selectFileIcon from './assets/selectFile.svg';
import magic from './assets/magic.svg';
import { useProjectGlobalState } from './hooks/useProjectGlobalState';

// @ts-ignore
import { shellPath } from 'shell-path';

export async function autoFillInfrastructure(
    infrastructureInputRef: React.RefObject<HTMLInputElement>
) {
    let PATH = await shellPath();

    child_process.exec(
        'adept --root',
        { env: { ...process.env, PATH } },
        (err: child_process.ExecException | null, stdout: string, _) => {
            if (infrastructureInputRef.current == null) return;

            if (err && err.code && err.code > 1) {
                console.log(err);
                infrastructureInputRef.current.value = 'Error: No Adept compiler in path';
            } else {
                infrastructureInputRef.current.value = stdout.trim();
            }
        }
    );
}

export function pickRootFile(
    rootFileInputRef: React.RefObject<HTMLInputElement>,
    nameInputRef: React.RefObject<HTMLInputElement>
) {
    (window as any).electronAPI.openFile().then((filename: string | null) => {
        if (filename && rootFileInputRef.current) {
            rootFileInputRef.current.value = filename;

            if (nameInputRef.current && nameInputRef.current.value == '') {
                nameInputRef.current.value = basename(dirname(filename));
            }
        }
    });
}

export function CreateProjectDialog(props: { exitCreatingProject: () => void }) {
    let [, setActiveProjectID] = useProjectGlobalState('projectID');
    let [, setCode] = useProjectGlobalState('code');
    let [, setFunctionName] = useProjectGlobalState('function');

    let infrastructureInputRef = useRef<HTMLInputElement>(null);
    let rootFileInputRef = useRef<HTMLInputElement>(null);
    let nameInputRef = useRef<HTMLInputElement>(null);

    const autoFill = useCallback(
        () => autoFillInfrastructure(infrastructureInputRef),
        [infrastructureInputRef]
    );

    const pickFile = useCallback(
        () => pickRootFile(rootFileInputRef, nameInputRef),
        [rootFileInputRef, nameInputRef]
    );

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

        createProject(name, filename, infrastructure)
            .then(newProjectID => {
                setActiveProjectID(newProjectID);
                setCode('');
                setFunctionName('main');
                props.exitCreatingProject();
            })
            .catch(e => {
                alert(e.message);
                props.exitCreatingProject();
            });
    };

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
                <div className="w-full flex justify-around">
                    <Button onClick={create} className="mb-8" childrenClassName="px-8">
                        Create Project
                    </Button>
                </div>
            </div>
        </div>
    );
}
