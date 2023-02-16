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

    import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';

    import "@fontsource/jetbrains-mono";

    import type { GraphJson } from './middlewares/fbp-graph/Types';
    import type { NofloComponentLoader } from './types/Component';

    import Svelvet, {
        type UserEdgeType,
        type NofloTheme,
        type NofloMinimap,
    } from '$lib/middlewares/svelvet';

    /*--------------------------------- Props --------------------------------*/

    // Core
    export let graph: GraphJson;
    export let loader: NofloComponentLoader = (key: string) => {
        return null;
    };

    // Config
    export let theme: NofloTheme = 'light';
    export let minimap: NofloMinimap = 'none';
    export let translucent: boolean = false;

    // Events
    const dispatch = createEventDispatcher();

    // Resize handler state
    let container: HTMLDivElement;
    let rs: ResizeObserver;
    let width = 1;
    let height = 1;

    // TEMP
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
        loader={loader}
        bind:theme
        width={width} height={height}
        background={true} minimap={minimap} snap
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
