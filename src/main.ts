import {
    Plugin,
    MarkdownView,
    TFile,
    WorkspaceLeaf
} from "obsidian";

import { createHomepage } from "./layouts/homepage";

export default class StarlitPlugin extends Plugin {

    dashboardpath = "000 Main/Dashboard.md";

    private isDashboardActive = false;

    private onDashboardReady = () => {
        this.mountQuickButtons();
    };

    // =========================
    // LOAD
    // =========================
    async onload() {

        console.log("ST⭐RLIT LOADED");

        window.addEventListener(
            "starlit-dashboard-ready",
            this.onDashboardReady
        );

        this.addRibbonIcon(
            "sparkles",
            "Open dashboard",
            async () => {

                let file = this.findDashboardFile();

                if (!file) {
                    file = await this.app.vault.create(
                        this.dashboardpath,
                        `---\nstarlit: dashboard\n---\n\n# Dashboard`
                    );
                }

                const leaf = this.app.workspace.getLeaf(true);
                await leaf.openFile(file);

                setTimeout(() => this.syncState(), 80);
            }
        );

        this.registerEvent(
            this.app.workspace.on("active-leaf-change", () => {
                this.syncState();
            })
        );

        this.registerEvent(
            this.app.workspace.on("file-open", () => {
                setTimeout(() => this.syncState(), 80);
            })
        );

        setTimeout(() => this.syncState(), 80);
    }

    onunload() {

        window.removeEventListener(
            "starlit-dashboard-ready",
            this.onDashboardReady
        );

        this.disableTheme();
        this.removeDashboard();
    }

    // =========================
    // CORE SYNC
    // =========================
    private syncState() {

    const leaves = this.app.workspace.getLeavesOfType("markdown");

    let dashboardFound = false;
    let dashboardLeaf: WorkspaceLeaf | null = null;

    for (const leaf of leaves) {

        const view = leaf.view;
        if (!(view instanceof MarkdownView)) continue;

        const file = view.file;
        if (!file) continue;

        const cache = this.app.metadataCache.getFileCache(file);
        const isDashboard = cache?.frontmatter?.starlit === "dashboard";

        if (isDashboard) {
            dashboardFound = true;
            dashboardLeaf = leaf;
            break;
        }
    }

    if (dashboardFound && dashboardLeaf) {
        this.setActive(dashboardLeaf);
    } else {
        this.setInactive();
    }
}

    // =========================
    // ACTIVE
    // =========================
    private setActive(leaf: WorkspaceLeaf) {

    this.enableTheme();

    // 💡 защита от повторного рендера
    const view = leaf.view;
    if (view instanceof MarkdownView) {

        const container = view.contentEl;
        const existing = container.querySelector(".starlit-mounted");

        if (!existing) {
            this.renderDashboard(leaf);
        }
    }

    this.isDashboardActive = true;
}

    // =========================
    // INACTIVE
    // =========================
    private setInactive() {

        if (!this.isDashboardActive) return;

        this.disableTheme();
        this.removeDashboard();

        this.isDashboardActive = false;
    }

    // =========================
    // DASHBOARD RENDER (FIXED)
    // =========================
    renderDashboard(leaf: WorkspaceLeaf) {

        const view = leaf.view;

        if (!(view instanceof MarkdownView)) return;

        // 💥 KEY FIX: stable container
        const container = view.contentEl;

        if (!container) return;

        let existing = container.querySelector(".starlit-mounted");

        if (existing) return;

        const markdown = container.querySelector(".markdown-reading-view") as HTMLElement;
        if (markdown) {
            markdown.style.display = "none";
        }

        const wrapper = document.createElement("div");
        wrapper.classList.add("starlit-mounted");

        wrapper.appendChild(createHomepage(this.app));

        container.appendChild(wrapper);
    }

    // =========================
    // CLEANUP
    // =========================
    removeDashboard() {

        document.querySelectorAll(".starlit-mounted")
            .forEach(el => el.remove());
    }

    // =========================
    // THEME
    // =========================
    enableTheme() {
        document.body.classList.add("starlit-theme");
    }

    disableTheme() {
        document.body.classList.remove("starlit-theme");
    }

    // =========================
    // QUICK BUTTONS
    // =========================
    mountQuickButtons() {

        const host = document.querySelector("[data-quick-buttons]") as HTMLElement | null;
        if (!host) return;

        if (host.dataset.mounted === "true") return;
        host.dataset.mounted = "true";

        const ButtonClass =
            (window as any)?.StarlitButtons?.NewTaskButton;

        if (!ButtonClass) return;

        new ButtonClass(host);
    }

    // =========================
    // FILE FINDER
    // =========================
    findDashboardFile(): TFile | null {

        const files = this.app.vault.getMarkdownFiles();

        for (const file of files) {

            const cache = this.app.metadataCache.getFileCache(file);

            if (cache?.frontmatter?.starlit === "dashboard") {
                return file;
            }
        }

        return null;
    }
}