import { useCallback, useReducer } from 'react';
import path, { basename, dirname } from 'path';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import sqlite from './logic/sqlite';
import { Project } from './components/Project';
import { NewProject } from './components/NewProject';
import { CreateProjectDialog } from './CreateProjectDialog';
import type { ProjectsAction, ProjectsState } from './ProjectsDispatch';
import { EditProjectDialog } from './EditProjectDialog';
import sortIcon from './assets/filterGray.svg';
import settingsIcon from './assets/settingsGray.svg';
import { AllSettingsDialog } from './AllSettingsDialog';
import { formatNumber } from './logic/formatNumber';

export default function Projects() {
    let [state, dispatch] = useReducer(
        (state: ProjectsState, action: ProjectsAction): ProjectsState => {
            switch (action.type) {
                case 'projects':
                    return { submenu: 'projects' };
                case 'create':
                    return { submenu: 'create' };
                case 'edit':
                    return {
                        submenu: 'edit',
                        projectID: action.payload.projectID,
                    };
                case 'settings':
                    return {
                        submenu: 'settings',
                    };
                default:
                    return { submenu: 'projects' };
            }
        },
        {
            submenu: 'projects',
        }
    );

    let newProject = useCallback(() => dispatch({ type: 'create' }), [dispatch]);
    let viewProjects = useCallback(() => dispatch({ type: 'projects' }), [dispatch]);
    let allSettings = useCallback(() => dispatch({ type: 'settings' }), [dispatch]);

    let rows = useAsyncMemo(
        async () =>
            await sqlite.query(
                `SELECT ProjectID, ProjectName, ProjectRootFilename, ProjectInfrastructure, ProjectCreated, ProjectLastOpened, ProjectUpdated FROM Project`
            ),
        [state]
    );

    let funcsInfo = useAsyncMemo(
        async () => sqlite.query(`SELECT count(*) as NumFunctions FROM Function`),
        [state]
    );

    let compositesInfo = useAsyncMemo(
        async () => await sqlite.query(`SELECT count(*) as NumComposites FROM Composite`),
        [state]
    );

    let callsInfo = useAsyncMemo(
        async () => await sqlite.query(`SELECT count(*) as NumCalls FROM Call`),
        [state]
    );

    let numFunctions = funcsInfo ? (funcsInfo as any)[0]['NumFunctions'] : 0;
    let numComposites = compositesInfo ? (compositesInfo as any)[0]['NumComposites'] : 0;
    let numCalls = callsInfo ? (callsInfo as any)[0]['NumCalls'] : 0;

    if (state.submenu == 'create') {
        return (
            <div className="absolute flex m-0 p-0 w-full h-auto justify-center">
                <CreateProjectDialog exitCreatingProject={viewProjects} />
            </div>
        );
    } else if (state.submenu == 'edit') {
        return (
            <div className="absolute flex m-0 p-0 w-full h-auto justify-center">
                <EditProjectDialog back={viewProjects} projectID={state.projectID ?? -1} />
            </div>
        );
    } else if (state.submenu == 'settings') {
        return (
            <div className="absolute flex m-0 p-0 w-full h-auto justify-center">
                <AllSettingsDialog back={viewProjects} />
            </div>
        );
    } else if (rows == null || rows.length == 0) {
        return (
            <div className="absolute flex m-0 p-0 w-full h-full">
                <div className="flex flex-wrap w-full h-full justify-center content-center">
                    <NewProject onClick={newProject} />
                </div>
            </div>
        );
    } else {
        return (
            <>
                <div className="absolute flex flex-wrap mt-11 mb-10 w-full justify-center">
                    <div className="mt-4 mb-2 w-full text-[#5C5C5C] h-8">
                        <div className="absolute w-full flex justify-center pointer-events-none select-none">
                            <p className="px-4">Projects: {rows.length}</p>
                            <p className="px-4">Functions: {formatNumber(numFunctions)}</p>
                            <p className="px-4">Composites: {formatNumber(numComposites)}</p>
                            <p className="px-4">Calls: {formatNumber(numCalls)}</p>
                        </div>
                        <img src={sortIcon} className="float-right px-12 select-none" />
                        <img
                            src={settingsIcon}
                            className="float-right pl-12 select-none"
                            onClick={allSettings}
                        />
                    </div>
                    <NewProject onClick={newProject} />
                    {rows?.map(
                        ({
                            ProjectID: projectID,
                            ProjectName: projectName,
                            ProjectRootFilename: rootFilename,
                            ProjectCreated: projectCreatedTime,
                            ProjectLastOpened: projectLastOpenedTime,
                            ProjectUpdated: _,
                        }: any) => {
                            let pathPreview =
                                basename(dirname(rootFilename)) + path.sep + basename(rootFilename);

                            return (
                                <Project
                                    name={projectName}
                                    created={projectCreatedTime}
                                    lastOpened={projectLastOpenedTime}
                                    key={projectID}
                                    projectID={projectID}
                                    pathPreview={pathPreview}
                                    dispatch={dispatch}
                                />
                            );
                        }
                    )}
                </div>
            </>
        );
    }
}
