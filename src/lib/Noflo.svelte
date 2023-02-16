<!--
 * @file Noflo.svelte
 * @author James Bennion-Pedley
 * @brief Graph UI for NoFlo
 * @date 13/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { afterUpdate, onMount, onDestroy, tick, createEventDispatcher } from 'svelte';

    import "@fontsource/jetbrains-mono";

    import type { GraphJson } from './middlewares/fbp-graph/Types';
    import type { NofloComponentLoader } from './types/Component';

    import type {
        NofloTheme,
        NofloMinimap,
    } from '$lib/middlewares/svelvet/store/types/types';

    import { createStoreEmpty } from '$lib/middlewares/svelvet/store/controllers/storeApi';
    import { addNodeToStore } from './middlewares/svelvet/nodes/controllers/util';
    import GraphView from '$lib/middlewares/svelvet/container/views/GraphView.svelte';

    /*--------------------------------- Props --------------------------------*/

    const pkStringGenerator = () => (Math.random() + 1).toString(36).substring(7);

    // Core
    export let graph: GraphJson;
    export let loader: NofloComponentLoader = (key: string) => {
        return null;
    };

    // Config
    export let theme: NofloTheme = 'light';
    export let minimap: NofloMinimap = 'none';
    export let translucent: boolean = false;

    export let background: boolean = true;
    export let movement: boolean = true;
    export let canvasId: string = pkStringGenerator();
    export let snap: boolean = false;
    export let snapTo: number = 15;
    export let nodeCreate: boolean = false;
    export let initialZoom = 3;
    export let initialLocation = { x: 0, y: 0 };

    // Events and State
    const dispatch = createEventDispatcher();
    const store = createStoreEmpty(canvasId);

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

    export function addNode(component: string) : boolean {
        const ret = addNodeToStore(store, canvasId, component);

        if(ret === false) {
            dispatch('error', 'invalid component!');
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
        store.movementStore.set(movement);
        const optionsObj = { snap, snapTo }; // TODO: rename to snap
        store.options.set(optionsObj); //
        store.nodeCreate.set(nodeCreate);

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
        store.movementStore.set(movement);
        const optionsObj = { snap, snapTo };
        store.options.set(optionsObj); //
        store.nodeCreate.set(nodeCreate);
        store.themeStore.set(theme);
    });
</script>


<div bind:this={container} class="container"
    class:svelvet-dark={theme === 'dark'}
    class:translucent
>
    <div
    class="svelvet"
    style={`width: ${width}px; height: ${height}px;`}
    >
        <GraphView
            {canvasId}
            {initialLocation}
            {initialZoom}
            {minimap}
        />
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
        font-family: 'Segoe UI', sans-serif;
    }
</style>
