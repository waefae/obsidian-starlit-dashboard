import { App } from "obsidian";
import { getVaultImage } from "../utils/image";

export function createDeadlines(app: App): HTMLElement {

    const deadlines = document.createElement("div");

    deadlines.classList.add("deadlines-block");

    const deadlinesImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/deadlines.png"
    );

    if (deadlinesImage) {

        deadlines.style.setProperty(
            "--deadlines-image",
            `url("${deadlinesImage}")`
        );

    }

    return deadlines;

}