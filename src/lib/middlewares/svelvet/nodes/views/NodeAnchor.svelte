<!--
 * @file NodeAnchor.svelte
 * @author James Bennion-Pedley
 * @brief Node connection anchors
 * @date 27/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    // import BaseEdge from "../../edges/views/Edges/BaseEdge.svelte";
    // import SimpleBezierEdge from "../../edges/views/Edges/SimpleBezierEdge.svelte";

    import BezierEdge from "./BezierEdge.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let canvasId: string;

    export let x: number;
    export let y: number;

    let active: boolean = false;
    let potential: boolean = false; // TODO make a global store

    /*-------------------------------- Methods -------------------------------*/

    function mousedown(e: MouseEvent | TouchEvent) {
        e.preventDefault();

        active = !active;
    }

    function outsidemousedown(e: MouseEvent | TouchEvent) {
        e.preventDefault();

        potential = !potential;
    }

    function mousemove(e: MouseEvent | TouchEvent) {
        e.preventDefault();
    }

    function mouseup(e: MouseEvent | TouchEvent) {
        e.preventDefault();

        active = false;
        potential = false;
    }

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<svelte:window
  on:mouseup={mouseup}
  on:mousedown={outsidemousedown}
  on:touchend={mouseup}
/>

<circle on:mousedown={mousedown} on:touchstart={mousedown}
    on:mousemove={mousemove} on:touchmove={mousemove}
    class="anchor" class:active class:potential cx={x} cy={y} r={3} stroke="#444444"
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
        fill:green;
    }

    .anchor.active {
        fill: red !important;
    }

    .anchor:hover {
        fill: #8da7a1;
        filter: drop-shadow( 0px 0px 3px rgba(0, 0, 0, .7));
    }

    :global(.svelvet-dark) .anchor:hover {
        filter: drop-shadow( 0px 0px 3px rgba(255, 255, 255, 0.7));
    }
</style>
