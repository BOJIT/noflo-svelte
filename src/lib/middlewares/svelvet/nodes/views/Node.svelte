<script lang="ts">
    import { afterUpdate } from 'svelte';
    import type { SvelteComponent } from "svelte";

    import { get } from 'svelte/store';

    import { findStore } from '../../store/controllers/storeApi';
    import type {
        NodeType,
    } from '../../store/types/types';

    import { forceCssHeightAndWidth } from '../../customCss/controllers/getCss';

    export let node: NodeType;
    export let canvasId: string;
    export let nodeId: string;

    const store = findStore(canvasId);

    const {
        nodesStore,
        edgesStore,
        anchorsStore,
        nodeSelected,
        lockedOption
    } = store;

    let isSelected = false;

    // forceCssHeightAndWidth forces the size of the node to be defined by CSS
    afterUpdate(() => {
        if (node.className) forceCssHeightAndWidth(store, node);
    });

    // this state variable is used for "clickCallback" functionality
    // on mouseup, the callback will fire only if userClick is true
    // isUserClick is set to true on mousedown, but set back to false in two cases
    //   (1) if the mouse moves, meaning that the node is being dragged
    //   (2) if the mouse leaves the node
    let isUserClick = false;

    //
    const mousedown = (e) => {
        e.preventDefault();
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
            const { x, y, width, height } = e.target.getBoundingClientRect();
            const offsetX =
            ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
            const offsetY =
            ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;

            const d3Scale = get(store.d3Scale);
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

  class="Node {node.className}"
  style="left: {node.positionX}px;
    top: {node.positionY}px;
    width: {node.width - 6}px;
    height: {node.height - 6}px;
    cursor: {$lockedOption ? "default" : "grab"};
    {node.bgColor ? `background-color: ${node.bgColor}` : ""}"
  id="svelvet-{node.id}"
>
    <svelte:component this={node.icon} color="#c8ced0" height="45px"/>

    {#if node.label !== ''}
        <div class="Label">{node.label}</div>
    {/if}
</div>

<style>
  .Node {
    background-color: #d8e0e2;
    border-radius: 12px;
    border: 3px solid black;

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

  .Label {
    background-color: rgba(100, 100, 100, 0.2);
    padding-top: 2px;
    padding-bottom: 3px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 3vmin;

    font-size: 10px;
    font-family: "JetBrains Mono";

    position: absolute;
    bottom: -30px;
  }

  :global(.svelvet-dark) .Label {
    color: white;
  }
</style>
