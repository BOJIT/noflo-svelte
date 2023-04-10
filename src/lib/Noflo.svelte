<!--
 * @file Noflo.svelte
 * @author James Bennion-Pedley
 * @brief Graph UI for NoFlo
 * @date 13/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import "@fontsource/jetbrains-mono";

    import {
        afterUpdate,
        onMount,
        onDestroy,
        tick,
        createEventDispatcher,
    } from "svelte";

    import type { GraphJson } from "$lib/middlewares/fbp-graph/Types";
    import type { NofloComponentLoader } from "$lib/types/Component";

    import type { NofloTheme, NofloMinimap } from "$lib/types/Noflo";

    import { storeCreateInstance } from "$lib/state/store";
    import { addNodeToStore } from "./middlewares/svelvet/nodes/controllers/util";

    import Graph from "$lib/components/Graph.svelte";

    /*--------------------------------- Props --------------------------------*/

    // Unique ID for a given graph: TODO ensure it is unique!
    const pkStringGenerator = () =>
        (Math.random() + 1).toString(36).substring(7);

    // Core
    export let graph: GraphJson;
    export let loader: NofloComponentLoader = (key: string) => {
        return null;
    };

    // Config
    export let theme: NofloTheme = "light";
    export let minimap: NofloMinimap = "none";
    export let translucent: boolean = false;

    export let background: boolean = true;
    export let initialZoom = 3;
    export let initialLocation = { x: 0, y: 0 };

    export let canvasId: string = pkStringGenerator();

    // Events and State
    const dispatch = createEventDispatcher();
    const store = storeCreateInstance(canvasId);

    // Resize handler state
    let container: HTMLDivElement;
    let rs: ResizeObserver;
    let width = 1;
    let height = 1;

    /*-------------------------------- Methods -------------------------------*/

    // TEMP
    // let initialEdges: UserEdgeType[] = [
    //     // { id: 'e1-2', source: "1", target: "2", type: "bezier", animate: true },
    //     // { id: 'e2-3', source: "2", target: "3", type: "bezier", animate: true },
    //     // { id: 'e4-5', source: "4", target: "5", type: "bezier", animate: true },
    // ];

    export function addNode(component: string): boolean {
        const ret = addNodeToStore(store, canvasId, component);

        if (ret === false) {
            dispatch("error", "invalid component!");
            return false;
        }

        return true;
    }

    /*------------------------------- Lifecycle ------------------------------*/

    onMount(async () => {
        // Set canvas state stores
        store.widthStore.set(width);
        store.heightStore.set(height);
        store.backgroundStore.set(background);

        // Set core graph stores
        store.loaderStore.set(loader);
        store.graphStore.set(graph);
        store.themeStore.set(theme);

        // Push graph state back to prop
        store.graphStore.subscribe((g) => {
            graph = g;
        });

        // Setup resizability watcher
        rs = new ResizeObserver((e) => {
            width = e[0].contentRect.width;
            height = e[0].contentRect.height;
        });
        rs.observe(container);

        await tick();
        width = container.clientWidth;
        height = container.clientHeight;
    });

    onDestroy(() => {
        // Destroy resizability watcher
        rs?.unobserve(container);
    });

    afterUpdate(() => {
        // set canvas related stores
        store.widthStore.set(width);
        store.heightStore.set(height);
        store.backgroundStore.set(background);
        store.themeStore.set(theme);
    });
</script>

<div
    bind:this={container}
    class="container"
    class:svelvet-dark={theme === "dark"}
    class:translucent
>
    <div class="svelvet" style={`width: ${width}px; height: ${height}px;`}>
        <Graph {canvasId} {initialLocation} {initialZoom} {minimap} />
    </div>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        background-color: rgb(243, 243, 243);
    }

    .container.svelvet-dark {
        background-color: rgb(22, 22, 22);
    }

    .container.translucent {
        background-color: rgba(243, 243, 243, 0.5);
    }

    .container.translucent.svelvet-dark {
        background-color: rgb(22, 22, 22, 0.5);
    }

    .svelvet {
        position: relative;
        overflow: hidden;
        display: grid;
        font-family: "Segoe UI", sans-serif;
    }
</style>
