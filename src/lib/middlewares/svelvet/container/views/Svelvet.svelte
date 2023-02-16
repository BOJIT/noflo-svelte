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

    import { afterUpdate, onMount } from 'svelte';

    import type {
        UserNodeType,
        UserEdgeType,
        NofloTheme,
        NofloMinimap,
    } from '../../store/types/types';

    import {
        createStoreEmpty,
        populateSvelvetStoreFromUserInput,
    } from '../../store/controllers/storeApi';

    import {
        sanitizeUserNodesAndEdges,
    } from '../controllers/middleware';

    import GraphView from './GraphView.svelte';

    /*--------------------------------- Props --------------------------------*/

    const pkStringGenerator = () => (Math.random() + 1).toString(36).substring(7);

    export let nodes: UserNodeType[]; // TODO: update type to make possible user id being a number
    export let edges: UserEdgeType[]; // TODO: update type to make possible user id being a number
    export let minimap: NofloMinimap = 'none';

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

    const store = createStoreEmpty(canvasId);

    /*-------------------------------- Methods -------------------------------*/


    /*------------------------------- Lifecycle ------------------------------*/
      // sets the state of the store to the values passed in from the Svelvet Component on initial render
    onMount(() => {
        // sanitize user input
        let output = sanitizeUserNodesAndEdges(nodes, edges);
        const userNodes = output['userNodes'];
        const userEdges = output['userEdges'];

        // set canvas related stores. you need to do this before setting node/edge related stores because
        // initializing nodes/edges might read relevant options from the store.
        store.widthStore.set(width);
        store.heightStore.set(height);
        store.backgroundStore.set(background);
        store.movementStore.set(movement);
        const optionsObj = { snap, snapTo }; // TODO: rename to snap
        store.options.set(optionsObj); //
        store.nodeCreate.set(nodeCreate);
        store.themeStore.set(theme);

        // set node/edge related stores
        populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);
    });

    afterUpdate(() => {
        // sanitize user input
        let output = sanitizeUserNodesAndEdges(nodes, edges);
        const userNodes = output['userNodes'];
        const userEdges = output['userEdges'];

        // set canvas related stores. you need to do this before setting node/edge related stores because
        // initializing nodes/edges might read relevant options from the store.
        store.widthStore.set(width);
        store.heightStore.set(height);
        store.backgroundStore.set(background);
        store.movementStore.set(movement);
        const optionsObj = { snap, snapTo }; // TODO: rename to snap
        store.options.set(optionsObj); //
        store.nodeCreate.set(nodeCreate);
        store.themeStore.set(theme);

        // set node/edge related stores
        populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);
    });
</script>


<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
  class="svelvet"
  style={`width: ${width}px; height: ${height}px;`}
>
    <GraphView
        {canvasId}
        {width}
        {height}
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
