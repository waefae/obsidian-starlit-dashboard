import { App } from "obsidian";
import { getVaultImage } from "../utils/image";

export function createProject(app: App): HTMLElement {

    const project = document.createElement("div");

    project.classList.add("project-block");

    project.innerHTML = `
        <div class="project-overlay"></div>
        <div class="project-content">
            PROJECT
        </div>
    `;

    const projectImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/project.png"
    );

    if (projectImage) {

        project.style.setProperty(
            "--project-image",
            `url("${projectImage}")`
        );

    }

    return project;

}