<!--
 * @file NodeAnchor.svelte
 * @author James Bennion-Pedley
 * @brief Node connection anchors
 * @date 27/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { findStore } from "../../store/controllers/storeApi";

    /*--------------------------------- Props --------------------------------*/

    export let canvasId: string;

    export let x: number;
    export let y: number;

    let active: boolean = false;
    let anchor: HTMLElement;

    const store = findStore(canvasId);

    const { edgeCandidateStore } = store;

    /*-------------------------------- Methods -------------------------------*/

    function mousedown(e: MouseEvent | TouchEvent) {
        if (active) return;

        e.preventDefault();

        // TODO get source position

        active = true;
        edgeCandidateStore.update((c) => {
            c.source = { x: x, y: y };
            c.active = true;
            return c;
        });
    }

    function mouseup(e: MouseEvent | TouchEvent) {
        // If selecting an anchor, do nothing
        if (e.target.classList.contains("anchor") && e.target != anchor) {
            // Create new edge
        }

        e.preventDefault();

        console.log("UP");

        active = false;
        edgeCandidateStore.update((c) => {
            c.active = false;
            return c;
        });
    }

    function mousemove(e: MouseEvent | TouchEvent) {
        if (!active) return;

        // TODO get relative space coordinates

        edgeCandidateStore.update((c) => {
            c.target = { x: e.screenX, y: e.screenY };
            return c;
        });

        console.log(e);
    }

    /*------------------------------- Lifecycle ------------------------------*/
</script>

<svelte:window
    on:mouseup={mouseup}
    on:mousemove={mousemove}
    on:touchmove={mousemove}
/>

<circle
    bind:this={anchor}
    on:mousedown={mousedown}
    on:mouseup={mouseup}
    on:mousemove={mousemove}
    on:touchmove={mousemove}
    class="anchor"
    class:active
    class:potential={$edgeCandidateStore.active}
    cx={x}
    cy={y}
    r={3}
    stroke="#444444"
/>

<!-- <SimpleBezierEdge edgeId={edge.id} {canvasId} /> -->

<!-- {#if active}
    <BaseEdge canvasId={canvasId} baseEdgeProps={{
        path: '0',
        animate: true,
        arrow: true,
        centerX: 0,
        centerY: 0,
    }} />
{/if} -->

<style>
    .anchor {
        pointer-events: auto;
        fill: white;
    }

    .anchor.potential {
        fill: green;
    }

    .anchor.active {
        fill: red !important;
    }

    .anchor:hover {
        fill: #8da7a1;
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.7));
    }

    :global(.svelvet-dark) .anchor:hover {
        filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.7));
    }
</style>
