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

    import { onMount, onDestroy, tick } from 'svelte';

    import "@fontsource/jetbrains-mono";

    import Graph from './middlewares/fbp-graph';
    import type { GraphJson } from './middlewares/fbp-graph/Types';
    import type { NofloComponentLoader } from './types/Component';

    import Svelvet, {
        type UserNodeType,
        type UserEdgeType,
        type NofloTheme,
        type NofloMinimap,
    } from '$lib/middlewares/svelvet';

    /*--------------------------------- Props --------------------------------*/

    export let theme: NofloTheme = 'light';
    export let minimap: NofloMinimap = 'none';
    export let translucent: boolean = false;

    export let loader: NofloComponentLoader = (key: string) => {
        return null;
    };

    export let graph: GraphJson;

    // Resize handler state
    let container: HTMLDivElement;
    let rs: ResizeObserver;
    let width = 1;
    let height = 1;

    // TEMP

    import { Folder, Settings, PaperPlane } from "@svicons/ionicons-outline";

    let initialNodes: UserNodeType[] = [
        {
            id: "1",
            icon: Folder,
            position: { x: 0, y: 50 },
            width: 60,
            height: 60,
            bgColor: '#ff7788',
        },
        {
            id: "2",
            icon: Settings,
            label: "component/2",
            position: { x: 100, y: 150 },
            width: 60,
            height: 120,
        },
        {
            id: "3",
            icon: PaperPlane,
            position: { x: 300, y: 50 },
            width: 60,
            height: 60,
        },
        {
            id: "4",
            icon: PaperPlane,
            position: { x: 300, y: -50 },
            width: 60,
            height: 60,
        },
        {
            id: "5",
            icon: Settings,
            position: { x: 200, y: -20 },
            width: 60,
            height: 60,
        },
    ];
    let initialEdges: UserEdgeType[] = [
        // { id: 'e1-2', source: "1", target: "2", type: "bezier", animate: true },
        // { id: 'e2-3', source: "2", target: "3", type: "bezier", animate: true },
        // { id: 'e4-5', source: "4", target: "5", type: "bezier", animate: true },
    ];

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    onMount(async () => {
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
    })
</script>


<div bind:this={container} class="container"
    class:svelvet-dark={theme === 'dark'}
    class:translucent
>
    <Svelvet
        bind:graph
        bind:nodes={initialNodes} bind:edges={initialEdges}
        width={width} height={height} background={true}
        minimap={minimap} bind:theme={theme} snap
    />
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

</style>
