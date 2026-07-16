import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

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
        `${ASSET_PATH}/project.png`
    );

    if (projectImage) {

        project.style.setProperty(
            "--project-image",
            `url("${projectImage}")`
        );

    }

    return project;

}