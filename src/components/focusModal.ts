import { App, Plugin } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";
import { getAllTasks, FocusTask } from "../modules/progress/progress";
import { FocusSource, saveFocusState, loadFocusState } from "../modules/progress/focusState";
import StarlitPlugin from "../main";
import { eventBus } from "../eventBus";

export class FocusModal {

    app: App;
    plugin: StarlitPlugin;

    overlay: HTMLElement | null = null;
    contentEl: HTMLElement | null = null;
    selectedSource: FocusSource | null = null;
    selectedTasks: FocusTask[] = [];
    escapeHandler = (event: KeyboardEvent) => {

        if (event.key === "Escape") {

            this.onClose();

        }

    };

    constructor(
        app: App,
        plugin: StarlitPlugin
    ) {
        this.app = app;
        this.plugin = plugin;
    }


   open() {

        console.log("MODAL OPEN START");

        this.overlay =
            document.createElement("div");

        console.log("OVERLAY CREATED");

        this.overlay.className =
            "focus-modal-overlay";


        const modal =
            document.createElement("div");

        modal.className =
            "focus-modal";


        const bg =
            getVaultImage(
                this.app,
                `${ASSET_PATH}/focus/modal.png`
            );


        if (bg) {

            modal.style.setProperty(
                "--focus-modal-image",
                `url("${bg}")`
            );

        }


        modal.innerHTML = `

            <div class="focus-modal-content">

                <button class="focus-modal-close">
                    ×
                </button>

                <div class="focus-modal-header">

                    <span class="focus-header-icon"></span>

                    <span class="focus-header-title">
                        Choose focus
                    </span>

                </div>

                <div class="focus-modal-tabs">

                    <button 
                        class="focus-tab active"
                        data-type="tasks"
                    >
                        🎯 Tasks
                    </button>


                    <button 
                        class="focus-tab"
                        data-type="page"
                    >
                        📁 Page
                    </button>

                </div>

                <div class="focus-modal-subtitle">

                    Select up to
                    <strong>3 tasks</strong>
                    for today's focus.

                </div>

                <div class="focus-search">

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        class="focus-search-input"
                    >

                    <span class="focus-search-icon">
                        🔍
                    </span>

                </div>

                <div class="focus-modal-body"></div>

                <div class="focus-footer">

                    <div class="focus-selection">

                        Selected

                        <span class="focus-selected-count">

                            0 / 3

                        </span>

                    </div>

                    <button class="focus-confirm">

                        Confirm

                    </button>

            </div>

            </div>

        `;


        this.overlay.appendChild(modal);

        document.body.appendChild(
            this.overlay
        );

        this.overlay.addEventListener(
            "click",
            (event) => {

                if (event.target === this.overlay) {
                    this.onClose();
                }

            }
        );


        document.addEventListener(
            "keydown",
            this.escapeHandler
        );

        this.contentEl = modal;

        console.log("BEFORE EVENTS");

        this.setupEvents();

        console.log("EVENTS DONE");

        void (async () => {

            const state =
                await loadFocusState(this.plugin);

            if (
                state.source?.type === "tasks" &&
                state.source.tasks
            ) {
                this.selectedTasks =
                    state.source.tasks.filter(task => !task.done);
            }

            this.renderTasks();

        })();

        console.log("TASKS DONE");

    }

    setupEvents() {

        const tabs =
            this.contentEl?.querySelectorAll(".focus-tab");

        if (!tabs) return;

        tabs.forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    tabs.forEach(t =>
                        t.classList.remove("active")
                    );

                    tab.classList.add("active");

                    const type =
                        tab.getAttribute("data-type");

                    if (type === "tasks") {

                        this.renderTasks();

                    }

                    if (type === "page") {

                        this.renderPages();

                    }

                }
            );

        });

        this.renderTasks();

        const confirm =
            this.contentEl?.querySelector(
                ".focus-confirm"
            );


        confirm?.addEventListener(
            "click",
            async () => {

                if (this.selectedTasks.length === 0)
                    return;

                const currentState =
                    await loadFocusState(this.plugin);

                const completedTasks =
                    currentState.source?.type === "tasks" &&
                    currentState.source.tasks
                        ? currentState.source.tasks.filter(task => task.done)
                        : [];

                const nextTasks = [...completedTasks];

                for (const task of this.selectedTasks) {
                    const exists = nextTasks.some(existing =>
                        existing.path === task.path &&
                        existing.line === task.line
                    );

                    if (!exists) {
                        nextTasks.push({
                            ...task,
                            done: false
                        });
                    }
                }

                await saveFocusState(
                    this.plugin,
                    {
                        source: {
                            type: "tasks",
                            tasks: nextTasks
                        },
                        date: new Date()
                            .toISOString()
                            .split("T")[0] ?? "",
                        locked: true
                    }
                );

                eventBus.emit("focus-updated");

                this.onClose();

            }
        );

        const close =
            this.contentEl?.querySelector(
                ".focus-modal-close"
            );


        close?.addEventListener(
            "click",
            () => {

                this.onClose();

            }
        );


    }



    renderTasks() {

        const body =
            this.contentEl?.querySelector(
                ".focus-modal-body"
            );

        if (!body) return;

        body.innerHTML = "";

        const counter =
            this.contentEl?.querySelector(
                ".focus-selected-count"
            );

        const updateCounter = () => {

            if (counter) {

                counter.textContent =
                    `${this.selectedTasks.length} / 3`;

            }

        };

        const updateCheckboxes = () => {

            const limitReached =
                this.selectedTasks.length >= 3;

            body.querySelectorAll(".focus-task-row")
                .forEach((row) => {

                    const checkbox =
                        row.querySelector("input") as HTMLInputElement;

                    if (!checkbox) return;

                    checkbox.disabled =
                        limitReached &&
                        !checkbox.checked;
                });
        };

        const tasks =
            getAllTasks(this.app);

        tasks.forEach(task => {

            const row =
                document.createElement("div");

            row.className =
                "focus-task-row";

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.checked =
                this.selectedTasks.some(
                    selected =>
                        selected.path === task.path &&
                        selected.line === task.line
                );

            checkbox.disabled =
                this.selectedTasks.length >= 3 &&
                !checkbox.checked;

            const text =
                document.createElement("span");

            text.textContent =
                task.text;

            row.append(
                checkbox,
                text
            );

            row.onclick = () => {

                const index =
                    this.selectedTasks.findIndex(
                        selected =>
                            selected.path === task.path &&
                            selected.line === task.line
                    );

                if (index >= 0) {

                    this.selectedTasks.splice(
                        index,
                        1
                    );

                    checkbox.checked = false;

                } else {

                    if (
                        this.selectedTasks.length >= 3
                    ) return;

                    this.selectedTasks.push(task);

                    checkbox.checked = true;

                }

                updateCounter();
                updateCheckboxes();

            };

            body.appendChild(row);

        });

        updateCounter();
        updateCheckboxes();

    }

    renderPages() {


        const body =
            this.contentEl?.querySelector(
                ".focus-modal-body"
            );


        if (!body) return;


        body.innerHTML = "";


        const pages =
            this.app.vault
                .getMarkdownFiles();



        pages.forEach(
            file => {


                const row =
                    document.createElement("div");


                row.className =
                    "focus-page-row";


                row.textContent =
                    file.basename;



                row.onclick = () => {


                    this.selectedSource = {

                        type: "page",

                        project: {

                            title: "",

                            rootPath: "",

                            lastPage: "",

                            totalTasks: 0,

                            completedTasks: 0
    
                        }

                    };


                };


                body.appendChild(row);


            }
        );


    }



    onClose() {

        this.overlay?.remove();

        document.removeEventListener(
            "keydown",
            this.escapeHandler
        );

        this.overlay = null;
        this.contentEl = null;

    }

}