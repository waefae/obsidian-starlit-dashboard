import { App, TFile } from "obsidian";

export function getVaultImage(
    app: App,
    path: string
): string | null {

    const file =
        app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
        return null;
    }

    return app.vault.getResourcePath(file);
}