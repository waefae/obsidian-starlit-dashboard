import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";
import { loadFocusState } from "../modules/progress/focusState";
import { getCurrentOpenTasks } from "../modules/progress/progress";
import StarlitPlugin from "../main";

export function createProgressBar(
    app: App,
    plugin: StarlitPlugin
): HTMLElement {

    const progress = document.createElement("div");

    const milestone = getVaultImage(
        app,
        `${ASSET_PATH}/svg/progress/milestone.svg`
    );

    const star = getVaultImage(
        app,
        `${ASSET_PATH}/svg/progress/current-star.svg`
    );

    progress.classList.add("course-progress");

    progress.innerHTML = `
        <div class="course-progress-track">

            <div class="course-progress-fill"></div>

            <div class="course-progress-milestones"></div>

            <span class="course-progress-star"></span>

        </div>
    `;

    async function refreshProgress() {

        const state =
            await loadFocusState(plugin);

        const project =
            state.project;

        if (!project) {
            return;
        }

        const currentOpen =
            getCurrentOpenTasks(app, project);

        const completed =
            Math.max(
                0,
                project.initialOpenTasks - currentOpen
            );

        const total =
            Math.max(
                1,
                project.initialOpenTasks
            );

        const percent =
            completed / total;

        const milestones =
            progress.querySelector(
                ".course-progress-milestones"
            ) as HTMLElement;

        milestones.innerHTML = "";

        const visibleSegments =
            Math.min(
                project.initialOpenTasks,
                12
            );

        const checkpointCount =
            Math.max(
                0,
                visibleSegments - 1
            );

        for (let i = 1; i <= checkpointCount; i++) {

            const milestone =
                document.createElement("span");

            milestone.className =
                "course-progress-milestone";

            milestone.style.left =
                `${(i / visibleSegments) * 100}%`;

            milestones.appendChild(
                milestone
            );

        }

        const star =
            progress.querySelector(
                ".course-progress-star"
            ) as HTMLElement;

        const position =
            Math.max(
                0,
                Math.min(
                    1,
                    percent
                )
            );

        star.style.left =
            `${position * 100}%`;

        const fill =
            progress.querySelector(
                ".course-progress-fill"
            ) as HTMLElement;

        fill.style.width =
            `${position * 100}%`;

        console.log({
            currentOpen,
            completed,
            total,
            percent
        });

    }

    if (milestone) {

        progress.style.setProperty(
            "--progress-milestone",
            `url("${milestone}")`
        );

    }

    if (star) {

        progress.style.setProperty(
            "--progress-star",
            `url("${star}")`
        );

    }
    void refreshProgress();

    return progress;

}