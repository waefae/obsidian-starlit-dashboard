import { App } from "obsidian";
import { ASSET_PATH } from "../constants";

export function createBottom(app: App): HTMLElement {

    const bottom = document.createElement("div");

    bottom.classList.add("bottom-block");

    bottom.textContent = "BOTTOM";

    return bottom;

}