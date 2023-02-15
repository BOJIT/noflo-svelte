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
    import type { NofloComponentLibrary } from '$lib/types/ComponentTypes';
</script>

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import { onMount, onDestroy, tick } from 'svelte';

    import Svelvet, {
        type UserNodeType,
        type UserEdgeType,
        type GraphTheme,
    }
    from '$lib/middlewares/svelvet';

    /*--------------------------------- Props --------------------------------*/

    export let theme: GraphTheme = 'light';
    export let library: NofloComponentLibrary = {};

    let container: HTMLDivElement;
    let rs: ResizeObserver;

    let width = 1;
    let height = 1;

    // TEMP

    import { Folder, Settings, PaperPlane } from "@svicons/ionicons-outline";

    const initialNodes: UserNodeType[] = [
        {
            id: "1",
            icon: Folder,
            position: { x: 0, y: 50 },
            width: 60,
            height: 60,
            bgColor: 'transparent',
            borderColor: 'transparent',
        },
        {
            id: "2",
            icon: Settings,
            position: { x: 100, y: 150 },
            width: 60,
            height: 120,
            bgColor: '#transparent',
            borderColor: 'transparent'
        },
        {
            id: "3",
            icon: PaperPlane,
            position: { x: 300, y: 50 },
            width: 60,
            height: 60,
            bgColor: '#transparent',
            borderColor: 'transparent'
        }
    ];
    const initialEdges: UserEdgeType[] = [
        { id: 'e1-2', source: "1", target: "2", animate: true },
        { id: 'e2-3', source: "2", target: "3", animate: true },
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
        minimap={true} bind:theme={theme}
    />
</div>


<style>
    .container {
        width: 100%;
        height: 100%;
    }
</style>
