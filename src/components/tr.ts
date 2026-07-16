import { App } from "obsidian";

export function createTR(app: App): HTMLElement {

    const tr = document.createElement("div");

    tr.classList.add("tr-block");

    tr.innerHTML = `
        <div class="recent-notes">
            recent-notes
        </div>

        <div class="tasks-block">
            tasks
        </div>
    `;

    return tr;

}