import { App } from "obsidian";
import { getVaultImage } from "../utils/image";

export function createIllustration(app: App): HTMLElement {

    const illustration = document.createElement("div");

    illustration.classList.add("illustration-block");

    const illustrationImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/illustration.png"
    );

    if (illustrationImage) {

        illustration.style.setProperty(
            "--illustration-image",
            `url("${illustrationImage}")`
        );

    }

    return illustration;

}