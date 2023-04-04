<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { get } from "svelte/store";

    import type { FbpNodeType } from "$lib/types/FbpGraph";
    import type { NofloStore } from "$lib/types/Noflo";

    import { colourShade } from "$lib/utils/colour";

    import Anchor from "$lib/components/Anchor.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let store: NofloStore;
    export let node: FbpNodeType;
    export let nodeId: string;

    const { nodesStore, nodeSelected, d3Scale } = store;

    let isSelected = false;

    const portSpacing = 17.5;

    // this state variable is used for "clickCallback" functionality
    // on mouseup, the callback will fire only if userClick is true
    // isUserClick is set to true on mousedown, but set back to false in two cases
    //   (1) if the mouse moves, meaning that the node is being dragged
    //   (2) if the mouse leaves the node
    let isUserClick = false;

    /*------------------------------- Lifecycle ------------------------------*/

    // Interactions (messy)
    const mousedown = (e) => {
        e.preventDefault();

        // If selecting an anchor, do nothing
        if (e.target.classList.contains("anchor")) return;

        // part of the "clickCallback" feature
        isUserClick = true;
        // when $nodeSelected = true, d3 functionality is disabled. The prevents panning while the node is being dragged
        $nodeSelected = true;
        isSelected = true;
    };
    const rightclick = (e) => {
        e.preventDefault();
        node = $nodesStore[nodeId];
        $nodeSelected = true; // when $nodeSelected = true, d3 functionality is disabled
        isSelected = false;
    };
    const mouseleave = (e) => {
        // part of the "clickCallback" feature
        isUserClick = false;
        // re-enables d3 when mouse leaves node
        $nodeSelected = false;
    };
    const mouseenter = (e) => {
        // disables d3 when mouse enters node
        nodeSelected.set(true);
    };
    const mousemove = (e) => {
        e.preventDefault();

        // part of the "clickCallback" feature
        isUserClick = false;
        // part of the "drag node" feature
        if (isSelected) {
            nodesStore.update((nodes) => {
                const node = nodes[nodeId];
                const d3Scale = get(store.d3Scale);
                // divide the movement value by scale to keep it proportional to d3Zoom transformations
                node.setPositionFromMovement(
                    e.movementX / d3Scale,
                    e.movementY / d3Scale
                );
                return { ...nodes };
            });
        }
    };

    const touchmove = (e) => {
        // part of the "clickCallback" feature
        isUserClick = false;
        // part of the "drag node" feature
        if (isSelected) {
            nodesStore.update((nodes) => {
                const node = nodes[nodeId];
                const { x, y, width, height } =
                    e.target.getBoundingClientRect();
                const offsetX =
                    ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
                const offsetY =
                    ((e.touches[0].clientY - y) / height) *
                    e.target.offsetHeight;

                // const d3Scale = get(store.d3Scale);
                // divide the movement value by scale to keep it proportional to d3Zoom transformations
                node.setPositionFromMovement(
                    offsetX - node.width / 2,
                    offsetY - node.height / 2
                );
                return { ...nodes };
            });
        }
    };

    const mouseup = (e) => {
        e.preventDefault();
        isSelected = false;
        // this implements the "clickCallback" feature
        if (node.clickCallback && isUserClick) node.clickCallback(node);

        // This implements the "snap to grid" feature
        if (get(store.options).snap) {
            // If user sets snap attribute as true inside Svelvet
            const snapResize = get(store.options).snapTo;
            const oldX = node.positionX;
            const oldY = node.positionY;
            const newX = Math.round(node.positionX / snapResize) * snapResize;
            const newY = Math.round(node.positionY / snapResize) * snapResize;

            nodesStore.update((nodes) => {
                const node = nodes[nodeId];
                node.setPositionFromMovement(newX - oldX, newY - oldY);
                return { ...nodes };
            });
        }
    };
</script>

<!-- TODO are these causing problems for zooming? -->
<svelte:window
    on:mousemove={mousemove}
    on:mouseup={mouseup}
    on:touchmove={touchmove}
    on:touchend={mouseup}
/>

<!-- on:wheel prevents page scroll when using mousewheel in the Node -->
<div
    on:mouseleave={mouseleave}
    on:mousedown={mousedown}
    on:contextmenu={rightclick}
    on:touchstart={mousedown}
    on:mouseenter={mouseenter}
    class="node"
    style="left: {node.positionX}px;
    top: {node.positionY}px;
    height: {node.height}px;
    width: {node.width}px;"
    id="svelvet-{node.id}"
>
    <div class="ring">
        <div
            class="icon"
            style={node.bgColor !== "default"
                ? `background-color: ${node.bgColor}`
                : ""}
        >
            <svelte:component
                this={node.icon}
                color={node.bgColor !== "default"
                    ? colourShade(node.bgColor, -30)
                    : "#c8ced0"}
                height="45px"
            />
        </div>
    </div>

    {#if node.label !== ""}
        <div class="label">{node.label}</div>
    {/if}

    <svg class="ports">
        {#each node.inPorts as ip, idx}
            <Anchor
                {store}
                x={11.5}
                y={node.height / 2 +
                    idx * portSpacing -
                    ((node.inPorts.length - 1) / 2) * portSpacing}
            />
            <text
                class="port-annotation"
                class:visible={$d3Scale > 2}
                x="17.5"
                y={node.height / 2 +
                    idx * portSpacing -
                    ((node.inPorts.length - 1) / 2) * portSpacing +
                    1.25}
            >
                {ip}
            </text>
        {/each}
        {#each node.outPorts as op, idx}
            <Anchor
                {store}
                x={node.width + 18.5}
                y={node.height / 2 +
                    idx * portSpacing -
                    ((node.outPorts.length - 1) / 2) * portSpacing}
            />
            <text
                class="port-annotation"
                class:visible={$d3Scale > 2}
                text-anchor="end"
                x={node.width + 12.5}
                y={node.height / 2 +
                    idx * portSpacing -
                    ((node.outPorts.length - 1) / 2) * portSpacing +
                    1.25}
            >
                {op}
            </text>
        {/each}
    </svg>
</div>

<style>
    .node {
        border-radius: 12px;
        border: 3px solid #444444;

        position: absolute;
        display: grid;
        place-items: center;

        user-select: none;
        justify-content: center;
        overscroll-behavior: auto;
        align-items: center;
        text-align: center;
        pointer-events: auto; /* this is needed for pointer events to work since we disable them in graphview */
    }

    .ring {
        grid-row: 1;
        grid-column: 1;

        width: 60px;
        height: 100%;

        position: relative;
    }

    .icon {
        position: absolute;
        top: 2px;
        left: 2px;

        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 8px;
        background-color: #d8e0e2f7;

        display: grid;
        place-items: center;
    }

    .ports {
        grid-row: 1;
        grid-column: 1;

        width: 90px;
        height: 100%;
        top: 0px;
        left: 0px;

        pointer-events: none;
        z-index: 5;
    }

    .port-annotation {
        font-size: 4px;
        font-family: "JetBrains Mono";
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.4s;
    }

    .port-annotation.visible {
        opacity: 1;
    }

    .label {
        background-color: rgba(100, 100, 100, 0.2);
        padding-top: 2px;
        padding-bottom: 3px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 3vmin;

        font-size: 10px;
        font-family: "JetBrains Mono";
        white-space: nowrap;

        position: absolute;
        bottom: -30px;
    }

    :global(.svelvet-dark) .label {
        color: white;
    }
</style>
