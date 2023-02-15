<!--
 * @file Noflo.svelte
 * @author James Bennion-Pedley
 * @brief Graph UI for NoFlo
 * @date 13/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts' context="module">
    /*--------------------------------- Types --------------------------------*/

    type NofloTheme = 'light' | 'dark';

    import type { NofloComponentLibrary } from '$lib/types/ComponentTypes';
</script>

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { onMount, onDestroy, tick } from 'svelte';

    import Svelvet, { type Node, type Edge } from '$lib/middlewares/svelvet';
    import GraphNode from '$lib/components/GraphNode.svelte';

    /*--------------------------------- Props --------------------------------*/

    export let Theme: NofloTheme = 'light';
    export let library: NofloComponentLibrary = {};

    let container: HTMLDivElement;
    let rs: ResizeObserver;

    let width = 1;
    let height = 1;

    // TEMP

    import { Folder } from "@svicons/ionicons-outline";

    const initialNodes: Node[] = [
        {
            id: 1,
            position: { x: 0, y: 50 },
            data: { custom: GraphNode, icon: Folder },
            width: 60,
            height: 60,
            bgColor: 'transparent',
            borderColor: 'transparent',
        },
        {
            id: 2,
            position: { x: 100, y: 150 },
            data: { custom: GraphNode, icon: Folder },
            width: 60,
            height: 60,
            bgColor: '#transparent',
            borderColor: 'transparent'
        },
        {
            id: 3,
            position: { x: 300, y: 50 },
            data: { custom: GraphNode, icon: Folder },
            width: 60,
            height: 60,
            bgColor: '#transparent',
            borderColor: 'transparent'
        }
    ];
    const initialEdges: Edge[] = [
        { id: 'e1-2', source: 1, target: 2, animate: true, edgeColor: 'white' },
        { id: 'e2-3', source: 2, target: 3, animate: true, edgeColor: 'white' },
    ];

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/



    onMount(async () => {
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
        rs?.unobserve(container);
    })
</script>


<div bind:this={container} class="container">
    <Svelvet nodes={initialNodes} edges={initialEdges} bgColor="transparent"
        width={width} height={height} background={true}
    />
</div>


<style>
    .container {
        width: 100%;
        height: 100%;
    }
</style>
