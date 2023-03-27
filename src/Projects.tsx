import { useCallback, useReducer } from 'react';
import path, { basename, dirname } from 'path';
import { useAsyncMemo } from './hooks/useAsyncMemo';
import sqlite from './logic/sqlite';
import { Project } from './components/Project';
import { NewProject } from './components/NewProject';
import { CreateProjectDialog } from './CreateProjectDialog';
import type { ProjectsAction, ProjectsState } from './ProjectsDispatch';
import { EditProjectDialog } from './EditProjectDialog';

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
                default:
                    return { submenu: 'projects' };
            }
        },
        {
            submenu: 'projects',
        }
    );

    let newProject = useCallback(() => {
        dispatch({ type: 'create' });
    }, [dispatch]);

    let viewProjects = useCallback(() => {
        dispatch({ type: 'projects' });
    }, [dispatch]);

    let rows = useAsyncMemo(async () => {
        return await sqlite.query(
            `SELECT ProjectID, ProjectName, ProjectRootFilename, ProjectInfrastructure FROM Project`
        );
    }, [state]);

    if (state.submenu == 'create') {
        return (
            <div className="absolute flex m-0 p-0 w-full h-auto justify-center">
                <CreateProjectDialog exitCreatingProject={viewProjects} />
            </div>
        );
    } else if (state.submenu == 'edit') {
        return (
            <div className="absolute flex m-0 p-0 w-full h-auto justify-center">
                <EditProjectDialog
                    exitCreatingProject={viewProjects}
                    projectID={state.projectID ?? -1}
                />
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
            <div className="absolute flex flex-wrap mt-12 mb-12 w-full justify-center">
                <NewProject onClick={newProject} />
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
                                name={projectName}
                                created={1235234}
                                lastOpened={1231432}
                                key={projectID}
                                projectID={projectID}
                                pathPreview={pathPreview}
                                dispatch={dispatch}
                            />
                        );
                    }
                )}
            </div>
        );
    }
}
