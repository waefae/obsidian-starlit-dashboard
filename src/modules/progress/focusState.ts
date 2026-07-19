import { Plugin } from "obsidian";
import { FocusTask, FocusProject } from "./progress";

export type FocusSource =
    | {
        type: "tasks";
        tasks: FocusTask[];
    }
    | {
        type: "page";
        project: FocusProject;
    };

export interface FocusState {
    source: FocusSource | null;
    date: string;
    locked: boolean;
}

function getToday(): string {
    return new Date().toISOString().split("T")[0] ?? "";
}

const STORAGE_KEY = "focusState";

export async function saveFocusState(
    plugin: Plugin,
    state: FocusState
) {
    await plugin.saveData({
        ...(await plugin.loadData()),
        [STORAGE_KEY]: state
    });
}

export async function loadFocusState(
    plugin: Plugin
): Promise<FocusState> {

    const data = await plugin.loadData();

    const state: FocusState | undefined =
        data?.[STORAGE_KEY];

    if (!state) {
        return {
            source: null,
            date: getToday(),
            locked: false
        };
    }

    if (state.date !== getToday()) {

        const cleared: FocusState = {
            source: null,
            date: getToday(),
            locked: false
        };

        await saveFocusState(plugin, cleared);

        return cleared;
    }

    return state;
}

export async function updateFocusedTaskDone(
    plugin: Plugin,
    path: string,
    line: number,
    done: boolean
) {
    const state = await loadFocusState(plugin);

    if (
        state.source?.type !== "tasks" ||
        !state.source.tasks
    ) {
        return;
    }

    const nextTasks = state.source.tasks.map(task =>
        task.path === path && task.line === line
            ? { ...task, done }
            : task
    );

    await saveFocusState(plugin, {
        ...state,
        source: {
            ...state.source,
            tasks: nextTasks
        }
    });
}