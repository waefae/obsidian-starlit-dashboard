import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

export function createIllustration(app: App): HTMLElement {

    const illustration = document.createElement("div");

    illustration.classList.add("illustration-block");

    const illustrationImage = getVaultImage(
        app,
        `${ASSET_PATH}/illustration.png`
    );

    if (illustrationImage) {

        illustration.style.setProperty(
            "--illustration-image",
            `url("${illustrationImage}")`
        );

    }

    return illustration;

}