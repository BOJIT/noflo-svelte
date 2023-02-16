<!--
 * @file Svelvet.svelte
 * @author James Bennion-Pedley
 * @brief Central Svelvet component
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { afterUpdate, onMount, createEventDispatcher } from 'svelte';


    import type { GraphJson } from '$lib/middlewares/fbp-graph/Types';
    import type { NofloComponentLoader } from '$lib/types/Component';

    import type {
        NofloTheme,
        NofloMinimap,
    } from '../../store/types/types';

    import { createStoreEmpty } from '../../store/controllers/storeApi';

    import GraphView from './GraphView.svelte';

    /*--------------------------------- Props --------------------------------*/

    const pkStringGenerator = () => (Math.random() + 1).toString(36).substring(7);

    // Required components
    export let graph: GraphJson;
    export let loader: NofloComponentLoader;

    // Optional config
    export let width: number = 1;
    export let height: number = 1;
    export let background: boolean = true;
    export let movement: boolean = true;
    export let canvasId: string = pkStringGenerator();
    export let snap: boolean = false;
    export let snapTo: number = 15;
    export let nodeCreate: boolean = false;
    export let initialZoom = 3;
    export let initialLocation = { x: 0, y: 0 };
    export let theme: NofloTheme = 'light';
    export let minimap: NofloMinimap = 'none';

    // Events
    const dispatch = createEventDispatcher();

    const store = createStoreEmpty(canvasId);

    /*-------------------------------- Methods -------------------------------*/


    /*------------------------------- Lifecycle ------------------------------*/

    onMount(() => {
        // set canvas related stores. you need to do this before setting node/edge related stores because
        // initializing nodes/edges might read relevant options from the store.
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


<style>
    .svelvet {
        position: relative;
        overflow: hidden;
        display: grid;
        font-family: 'Segoe UI', sans-serif;
    }
</style>
