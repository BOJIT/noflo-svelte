<!--
 * @file BaseEdge.svelte
 * @author James Bennion-Pedley
 * @brief Base edge type that connects two nodes
 * @date 27/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { storeGetInstance } from "$lib/state/store";

    // TODO make this somewhat aligned with central definitions
    import type { EdgeProps } from "../middlewares/svelvet/edges/views/Edges/types";

    import EdgeText from "$lib/components/EdgeText.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let baseEdgeProps: EdgeProps;
    export let canvasId;

    const store = storeGetInstance(canvasId);
    const theme = store.themeStore;

    const defaultArrow = `0 0, 9 4.5, 0 9`;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

    // destructuring the props passed in from the parent component
    $: ({
        path,
        animate,
        arrow,
        label,
        labelBgColor,
        labelTextColor,
        edgeColor,
        centerX,
        centerY,
    } = baseEdgeProps);

    // setting edge text props
    $: edgeTextProps = {
        label: label,
        labelBgColor: labelBgColor,
        labelTextColor: labelTextColor,
        centerX: centerX,
        centerY: centerY,
    };
</script>

<defs>
    <marker
        id="arrow"
        markerWidth="9"
        markerHeight="9"
        refX="8"
        refY="4"
        orient="auto"
    >
        <polygon points={defaultArrow} fill="gray" />
    </marker>
</defs>

<!-- This is an invisible edge that is used to implement event events,
     because the visible edge is thin and hard to click on -->
<path
    class="edge-selector"
    d={path}
    fill="transparent"
    stroke={"red"}
    stroke-opacity="0"
    stroke-width="20"
/>

{#if arrow}
    <path
        class:animate
        d={path}
        fill="blue"
        stroke={edgeColor !== "default"
            ? edgeColor
            : $theme === "dark"
            ? "white"
            : "black"}
        marker-end="url(#arrow)"
        aria-label="svg-path"
    />
{:else}
    <path
        class:animate
        d={path}
        fill="transparent"
        stroke={edgeColor !== "default"
            ? edgeColor
            : $theme === "dark"
            ? "white"
            : "black"}
        aria-label="svg-path"
    />
{/if}

{#if edgeTextProps.label}
    <EdgeText {edgeTextProps} />
{/if}

<style>
    .animate {
        stroke-dasharray: 5;
        animation: dash 50000s linear;
    }

    @keyframes dash {
        from {
            stroke-dashoffset: 1000000;
        }
    }

    .edge-selector:hover {
        stroke: "red";
        stroke-opacity: 0.5;
    }
</style>
