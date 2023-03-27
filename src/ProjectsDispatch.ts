
export type ProjectsSubmenu = 'projects' | 'create' | 'edit';

export type ProjectsState = {
    submenu: ProjectsSubmenu;
    projectID?: number;
};

export type ProjectsAction =
    | { type: 'projects' }
    | { type: 'create' }
    | { type: 'edit'; payload: { projectID: number } };
