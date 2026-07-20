import { App, TFile } from "obsidian";
import { getVaultImage } from "../utils/image";
import { createProgressBar } from "./progressBar";
import { ASSET_PATH } from "../constants";
import { FocusModal } from "./focusModal";
import { loadFocusState } from "../modules/progress/focusState";
import StarlitPlugin from "../main";
import { FocusTask, getCurrentOpenTasks } from "../modules/progress/progress";
import { updateFocusedTaskDone } from "../modules/progress/focusState";
import { eventBus } from "../eventBus";
import { toggleTask } from "../modules/progress/toggleTask";

async function renderTasks(
    app: App,
    plugin: StarlitPlugin,
    container: HTMLElement,
    tasks: FocusTask[]
) {
    container.innerHTML = "";

    for (const task of tasks) {

        const row = document.createElement("div");
        row.className = "task";

        if (task.done) {
            row.classList.add("completed");
        }

        const dot = document.createElement("span");
        dot.className = "task-dot";

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        row.append(dot, text);

        dot.addEventListener(
            "click",
            async (event) => {

                event.stopPropagation();

                const nextDone = !task.done;
                task.done = nextDone;
                row.classList.toggle("completed", nextDone);

                try {

                    await toggleTask(app, task);
                    await updateFocusedTaskDone(
                        plugin,
                        task.path,
                        task.line,
                        nextDone
                    );

                    eventBus.emit("focus-updated");

                } catch (error) {

                    task.done = !nextDone;
                    row.classList.toggle("completed", task.done);
                    console.error(error);

                }

            }
        );

        container.appendChild(row);
    }
}

export function createFocus(
    app: App,
    plugin: StarlitPlugin
): HTMLElement {

    const focus = document.createElement("div");

    focus.classList.add("focus-block");

    const focusImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/focus.png`
    );

    const borderImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/border.png`
    );

    const selectImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/select.png`
    );

    const badgeImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/badge.png`
    );

    const sparkleImage = getVaultImage(
        app,
        `${ASSET_PATH}/svg/focus/sparkle.svg`
    );
    
    focus.innerHTML = `

        <div class="focus-corner tl"></div>
        <div class="focus-corner tr"></div>
        <div class="focus-corner bl"></div>
        <div class="focus-corner br"></div>

        <div class="focus-header">

            <span class="focus-star"></span>

            <span>FOCUS</span>

            <span class="focus-star"></span>

        </div>

        <div class="focus-layout">

            <div class="focus-badge">

                <div class="course-grid">

                    <div class="course-info">

                        <div class="course-title">
                            Quantum Mechanics
                        </div>

                        <div class="course-subtitle">
                            Lecture 7
                        </div>

                    </div>

                    <div class="course-right">

                        <div class="course-counter">
                            2 / 5
                        </div>

                    </div>

                </div>

            </div>

            <div class="focus-divider"></div>

           <div class="focus-tasks"></div>

        </div>

        <div class="focus-select"></div>

    `;

    const tasksContainer =
    focus.querySelector(".focus-tasks") as HTMLElement;

    const titleEl =
        focus.querySelector(".course-title") as HTMLElement;

    const subtitleEl =
        focus.querySelector(".course-subtitle") as HTMLElement;

    const counterEl =
        focus.querySelector(".course-counter") as HTMLElement;

    async function refreshFocus() {

        tasksContainer.innerHTML = "";

        const state =
            await loadFocusState(plugin);

        const tasks = state.tasks;
        const project = state.project;

        if (project) {

            const currentOpen =
                getCurrentOpenTasks(
                    app,
                    project
                );

            const completedSinceSelection =
                Math.max(
                    0,
                    project.initialOpenTasks -
                    currentOpen
                );

            titleEl.textContent =
                project.title;

            const file =
                app.vault.getAbstractFileByPath(
                    project.lastPage
                );

            if (file instanceof TFile) {

                subtitleEl.textContent =
                    file.basename;

                subtitleEl.onclick = async () => {

                    await app.workspace
                        .getLeaf(true)
                        .openFile(file);

                };

            } else {

                subtitleEl.textContent = "";

                subtitleEl.onclick = null;

            }

            counterEl.textContent =
                `${completedSinceSelection} / ${project.initialOpenTasks}`;

        } else {

            titleEl.textContent =
                "No project selected";

            subtitleEl.textContent = "";

            subtitleEl.onclick = null;

            counterEl.textContent = "";

        }

        if (tasks.length === 0) {
            return;
        }

        await renderTasks(
            app,
            plugin,
            tasksContainer,
            tasks
        );
    }

    const select =
        focus.querySelector(".focus-select");

    select?.addEventListener(
        "click",
        () => {
            console.log("FOCUS SELECT CLICK");
            new FocusModal(app, plugin).open();
        }
    );

    const badge = focus.querySelector(
        ".focus-badge"
    ) as HTMLElement;

    const progressBar =
        createProgressBar(app, plugin);

    badge.appendChild(progressBar);

    void refreshFocus();

    if (focusImage) {

        focus.style.setProperty(
            "--focus-image",
            `url("${focusImage}")`
        );

    }

    if (borderImage) {

        focus.style.setProperty(
            "--focus-border-image",
            `url("${borderImage}")`
        );

    }

    if (selectImage) {

        focus.style.setProperty(
            "--focus-select-image",
            `url("${selectImage}")`
        );

    }

    if (badgeImage) {

        focus.style.setProperty(
            "--focus-badge-image",
            `url("${badgeImage}")`
        );

    }

    if (sparkleImage) {

        focus.style.setProperty(
            "--focus-sparkle-image",
            `url("${sparkleImage}")`
        );

    }

    const unsubscribe =
        eventBus.on(
            "focus-updated",
            () => {
                void refreshFocus();
            }
        );

    return focus;

}