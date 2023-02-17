<script lang="ts">
    import { get } from 'svelte/store';

    import { findStore } from '../../store/controllers/storeApi';
    import type {
        NodeType,
    } from '../../store/types/types';

    const portSpacing = 17.5;

    export let node: NodeType;
    export let canvasId: string;
    export let nodeId: string;

    const store = findStore(canvasId);

    const {
        nodesStore,
        nodeSelected,
        d3Scale,
    } = store;

    let isSelected = false; // This signifies THIS node is selected

    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        R = Math.round(R)
        G = Math.round(G)
        B = Math.round(B)

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }



    const mousedown = (e) => { // and touchstart
        e.preventDefault();

        isSelected = true;
        $nodeSelected = true;
    };

    const mouseup = (e) => {    // and touchend
        e.preventDefault();

        if(!isSelected)
            return;

        isSelected = false;
        $nodeSelected = false;

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

    const rightclick = (e) => {
        e.preventDefault();

        node = $nodesStore[nodeId];
        // $nodeSelected = true; // when $nodeSelected = true, d3 functionality is disabled
    };

    const mouseleave = (e) => {
        // re-enables d3 when mouse leaves node
        // $nodeSelected = false;
    };

    const mouseenter = (e) => {
        // disables d3 when mouse enters node
        // $nodeSelected = true;
    };

    const mousemove = (e) => {
        e.preventDefault();

        if(!isSelected)
            return;

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
        if(!isSelected)
            return;

        // part of the "drag node" feature
        if (isSelected) {
            nodesStore.update((nodes) => {
                const node = nodes[nodeId];
                const { x, y, width, height } = e.target.getBoundingClientRect();
                const offsetX =
                ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
                const offsetY =
                ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;

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
</script>


<svelte:window
    on:mousemove={mousemove}
    on:mouseup={mouseup}
    on:touchmove={touchmove}
    on:touchend={mouseup}
/>

<!-- on:wheel prevents page scroll when using mousewheel in the Node -->
<div
    on:mouseenter={mouseenter}
    on:mouseleave={mouseleave}
    on:mousedown={mousedown}
    on:touchstart={mousedown}
    on:contextmenu={rightclick}

    class="node"
    style="left: {node.positionX}px;
        top: {node.positionY}px;
        height: {node.height}px;
        width: {node.width}px;"
    id="svelvet-{node.id}"
>
    <div class="ring">
        <div class="icon"  style="{node.bgColor !== 'default' ? `background-color: ${node.bgColor}` : ""}">
            <svelte:component this={node.icon}
                color={node.bgColor !== 'default' ? shadeColor(node.bgColor, -30) : "#c8ced0"}
                height="45px"/>
        </div>
    </div>

    {#if node.label !== ''}
        <div class="label">{node.label}</div>
    {/if}

    <svg class="ports">
        {#each node.inPorts as ip, idx }
            <circle cx={6.5}
                cy={node.height/2 + (idx * portSpacing) - (node.inPorts.length - 1)/2 * portSpacing}
                r={3} stroke="#444444" fill="white" />
                <text class="port-annotation" class:visible={$d3Scale > 2}
                    x="12.5" y={node.height/2 + (idx * portSpacing) - (node.inPorts.length - 1)/2 * portSpacing + 1.25}>
                    {ip}
                </text>
        {/each}
        {#each node.outPorts as op, idx }
            <circle cx={node.width + 13.5}
                cy={node.height/2 + (idx * portSpacing) - (node.outPorts.length - 1)/2 * portSpacing}
                r={3} stroke="#444444" fill="white" />

            <text class="port-annotation" class:visible={$d3Scale > 2}
                text-anchor="end" x={node.width + 7.5} y={node.height/2 + (idx * portSpacing) - (node.outPorts.length - 1)/2 * portSpacing + 1.25}>
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
        border-radius:8px;
        background-color: #d8e0e2f7;

        display: grid;
        place-items: center;
    }

    .ports {
        grid-row: 1;
        grid-column: 1;

        width: 80px;
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
