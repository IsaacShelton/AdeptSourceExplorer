import { createGlobalState } from "react-hooks-global-state";

import type { Range } from '@/Range';

export const { useGlobalState: useProjectGlobalState } = createGlobalState({ projectID: -1, filter: 'none', code: '', tab: 'Project', range: null as Range | null, function: 'main' });
