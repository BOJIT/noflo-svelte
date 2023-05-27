<!--
 * @file MinimapNode.svelte
 * @author James Bennion-Pedley
 * @brief Node representation in Minimap
 * @date 13/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import type { FbpNodeType } from "$lib/types/FbpGraph";

    /*--------------------------------- Props --------------------------------*/

    export let key;
    export let node: FbpNodeType;
    export let heightRatio;
    export let widthRatio;
    export let nodeXleftPosition;
    export let nodeYbottomPosition;

    let top = 0;
    let left = 0;
    let nWidth = 0;
    let nHeight = 0;

    //nHeight/nWidth represent the height and width of the grey nodes
    //top/left represent the actual position of the grey nodes on the minimap

    // TODO get height based on numPorts

    /*------------------------------- Lifecycle ------------------------------*/

    $: {
        nHeight = Math.max(54 * heightRatio, 5);
        nWidth = Math.max(54 * widthRatio, 5);
        top =
            node.positionY * heightRatio -
            nodeYbottomPosition * heightRatio +
            1;
        left = node.positionX * widthRatio - nodeXleftPosition * widthRatio + 1;
    }
</script>

<div
    class="minimap-nodes minimap-nodes-{key}"
    style="top: {top}px; left: {left}px; height: {nHeight}px; width:{nWidth}px"
/>

<style>
    .minimap-nodes {
        position: absolute;
        background-color: black;
        color: black;
        opacity: 20%;
        z-index: 9;
        border-radius: 0.1rem;
    }
</style>
