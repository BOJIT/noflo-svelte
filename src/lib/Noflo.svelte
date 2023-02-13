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

    import type { NofloComponentLibrary } from './types/ComponentTypes';
</script>

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { onMount, onDestroy, tick } from 'svelte';

    import Svelvet, { type Node, type Edge } from 'svelvet';

    /*--------------------------------- Props --------------------------------*/

    export let Theme: NofloTheme = 'light';
    export let library: NofloComponentLibrary = {};

    let container: HTMLDivElement;
    let rs: ResizeObserver;

    let width = 1;
    let height = 1;

    // TEMP
    const initialNodes: Node[] = [
        {
            id: 1,
            position: { x: 200, y: 50 },
            data: { label: 'Input Node' },
            width: 175,
            height: 40,
            bgColor: 'white'
        },
        {
            id: 2,
            position: { x: 25, y: 150 },
            data: { label: 'Option #1' },
            width: 175,
            height: 40,
            bgColor: '#B8FFC6',
            borderColor: 'transparent'
        },
        {
            id: 3,
            position: { x: 375, y: 150 },
            data: { label: 'Option #2' },
            width: 175,
            height: 40,
            bgColor: '#FFB8B8',
            borderColor: 'transparent'
        }
    ];
    const initialEdges: Edge[] = [
        { id: 'e1-2', source: 1, target: 2, label: ' YES ', animate: true },
        { id: 'e2-3', source: 1, target: 3, label: ' NO ', animate: true }
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
