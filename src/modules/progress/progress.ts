import { App, TFile } from "obsidian";

interface DataviewAPI {
    pages(): any;
    page(path: string): any;
}

export interface FocusTask {

    text: string;

    path: string;

    line: number;

    priority?: string;

    originalText?: string;

    done: boolean;

}

export interface FocusProject {

    title: string;

    rootPath: string;

    lastPage: string;

    totalTasks: number;

    completedTasks: number;

}

export interface ProgressState {

    total: number;

    completed: number;

    percent: number;

}


export function cleanTaskText(text: string): string {

    return text
        .replace(/⏰.*|📅.*|🔁.*/g, "")
        .replace(/🔺|⏫|🔼|🔽|⏬/g, "")
        .trim();

}


export function getPriority(text: string): string {

    if (text.includes("🔺")) return "highest";
    if (text.includes("⏫")) return "high";
    if (text.includes("🔼")) return "medium";
    if (text.includes("🔽")) return "low";
    if (text.includes("⏬")) return "lowest";

    return "low";

}


export function getAllTasks(app: App): FocusTask[] {

    const dvApi = (
        app as any
    ).plugins.plugins["dataview"]?.api as DataviewAPI | undefined;

    if (!dvApi) return [];

    const tasks: FocusTask[] = [];

    dvApi.pages().forEach((page: any) => {

        if (!page.file?.tasks) return;

        page.file.tasks.forEach((task: any) => {

            if (task.completed) {
                return;
            }

            if (task.status === "-") {
                return;
            }

            tasks.push({

                text: cleanTaskText(task.text),

                path: task.path,

                line: task.line,

                priority: getPriority(task.text),

                originalText: task.text,

                done: false

            });

        });

    });

    return tasks;

}

export function getProjects(app: App): FocusProject[] {

    return [];

}

export function getPageTasks(
    app: App,
    path: string
): FocusTask[] {

    const dvApi = (
        app as any
    ).plugins.plugins["dataview"]?.api as DataviewAPI | undefined;

    if (!dvApi) return [];

    const page = dvApi.page(path);

    if (!page?.file?.tasks) return [];

    return page.file.tasks.map((task: any) => ({

        text: cleanTaskText(task.text),

        path,

        line: task.line,

        priority: getPriority(task.text),

        originalText: task.text,

        done: task.completed

    }));

}


export function calculateProgress(
    tasks: FocusTask[]
): ProgressState {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.done
    ).length;


    return {

        total,

        completed,

        percent: total
            ? Math.round((completed / total) * 100)
            : 0

    };

}