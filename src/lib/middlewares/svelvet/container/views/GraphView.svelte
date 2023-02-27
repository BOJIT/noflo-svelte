<!--
 * @file GraphView.svelte
 * @author James Bennion-Pedley
 * @brief Primary graph view visualisation
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { onMount } from 'svelte';

    import { zoom, zoomTransform, zoomIdentity } from 'd3-zoom';
    import { select, selectAll, pointer } from 'd3-selection';

    import type { NofloMinimap, PositionType } from '../../store/types/types';
    import { findStore } from '../../store/controllers/storeApi';
    import { determineD3Instance, zoomInit } from '../../d3/controllers/d3';

    import BezierEdge from '../../nodes/views/BezierEdge.svelte';
    import SimpleBezierEdge from '../../edges/views/Edges/SimpleBezierEdge.svelte';
    import EdgeAnchor from '../../edges/views/Edges/EdgeAnchor.svelte';
    import Node from '../../nodes/views/Node.svelte';
    import TemporaryEdge from '../../interactiveNodes/views/TemporaryEdge.svelte';
    import MinimapBoundless from '../../minimap/MinimapBoundless.svelte';

    /*--------------------------------- Props --------------------------------*/

    export let canvasId: string;
    export let initialZoom = 3;
    export let initialLocation: PositionType;
    export let minimap: NofloMinimap = 'none';

    // here we lookup the store using the unique key
    const store = findStore(canvasId);
    const key = canvasId;

    const {
        edgesStore,
        nodesStore,
        anchorsStore,
        temporaryEdgeStore,
        nodeSelected,
        backgroundStore,
        movementStore,
        widthStore,
        heightStore,
        d3Scale,
        themeStore,
    } = store;

    $: nodes = Object.values($nodesStore);
    $: edges = Object.values($edgesStore);
    $: anchors = Object.values($anchorsStore);
    $: tempEdges = $temporaryEdgeStore;

    // declaring the grid and dot size for d3's transformations and zoom
    const gridSize = 15;
    const dotSize = 10;
    const gridMultiplier = 3;

    // d3Translate is used for the minimap
    let d3Translate = { x: 0, y: 0, k: 1 };

    // leveraging d3 library to zoom/pan
    let d3 = {
        zoom,
        zoomTransform,
        zoomIdentity,
        select,
        selectAll,
        pointer,
    };

    let d3Zoom = determineD3Instance(
        d3,
        nodeSelected,
        handleZoom,
    );

    /*-------------------------------- Methods -------------------------------*/

    function miniMapClick(event: CustomEvent) {
      // For edges
      d3.select(`.Edges-${key}`)
        .transition()
        .duration(500)
        .call(d3Zoom.translateTo, event.detail.x, event.detail.y);
      // For nodes
      d3.select(`.Nodes-${key}`)
        .transition()
        .duration(500)
        .call(d3Zoom.translateTo, event.detail.x, event.detail.y);
    }

    function handleZoom(e: any) {
        if (!$movementStore) return;
        //add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
        d3Scale.set(e.transform.k);
        // should not run d3.select below if backgroundStore is false
        if (backgroundStore) {
            d3.select(`#background-${canvasId}`)
                .attr('x', e.transform.x)
                .attr('y', e.transform.y)
                .attr('width', gridSize * e.transform.k)
                .attr('height', gridSize * e.transform.k)
                .selectAll('#dot')
                .attr('x', (gridSize * e.transform.k) / 2 - dotSize / 2)
                .attr('y', (gridSize * e.transform.k) / 2 - dotSize / 2)
                .attr('opacity', Math.min(e.transform.k - 0.5, 1));

            d3.select(`#coarse-background-${canvasId}`)
                .attr('x', e.transform.x)
                .attr('y', e.transform.y)
                .attr('width', gridMultiplier * gridSize * e.transform.k)
                .attr('height', gridMultiplier * gridSize * e.transform.k)
                .selectAll('#coarse-dot')
                .attr('x', gridMultiplier * ((gridSize * e.transform.k) / 2 - dotSize / 2))
                .attr('y', gridMultiplier * ((gridSize * e.transform.k) / 2 - dotSize / 2))
                .attr('opacity', Math.min(e.transform.k - 0.2, 1));
        }

        // transform 'g' SVG elements (edge, edge text, edge anchor)
        d3.select(`.Edges-${canvasId} g`).attr('transform', e.transform);
        // transform div elements (nodes)
        let transform = d3.zoomTransform(this);
        d3Translate = transform;
        // selects and transforms all node divs from class 'Node' and performs transformation
        d3.select(`.Node-${canvasId}`)
        .style(
            'transform',
            'translate(' +
            transform.x +
            'px,' +
            transform.y +
            'px) scale(' +
            transform.k +
            ')'
        )
        .style('transform-origin', '0 0');
    }

    /*------------------------------- Lifecycle ------------------------------*/

    onMount(() => {
        // actualizes the d3 instance
        d3.select(`.Edges-${canvasId}`).call(d3Zoom);
        d3.select(`.Nodes-${canvasId}`).call(d3Zoom);
        d3.select(`#background-${canvasId}`).call(d3Zoom);
        d3.selectAll('#dot').call(d3Zoom); // TODO: this should be a class, not an ID
        d3Translate = zoomInit(
            d3,
            canvasId,
            d3Zoom,
            d3Translate,
            initialLocation,
            initialZoom,
            d3Scale
        );
    });
</script>


<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<div id="graphview-container">
    {#if minimap !== 'none'}
        <div class="pointer-events-auto">
            <MinimapBoundless on:message={miniMapClick} {key} {d3Translate} {store} location={minimap}/>
        </div>
    {/if}

    <div class={`Nodes Nodes-${canvasId}`} on:contextmenu|preventDefault>
        <!-- This container is transformed by d3zoom -->
        <div class={`Node Node-${canvasId}`}>
            {#each nodes as node}
                <Node {node} {canvasId} nodeId={node.id} />
            {/each}
        </div>
    </div>
</div>

<!-- rendering dots on the background depending on the zoom level -->
<svg
    class={`Edges Edges-${canvasId}`}
    viewBox="0 0 {$widthStore} {$heightStore}"
    on:contextmenu|preventDefault>
    <defs>
        <pattern
            id={`background-${canvasId}`}
            x="0"
            y="0"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
        >
            <circle
                id="dot"
                cx={gridSize / 2 - dotSize / 2}
                cy={gridSize / 2 - dotSize / 2}
                r="0.5"
                style="fill: gray"
            />
        </pattern>

        <pattern
            id={`coarse-background-${canvasId}`}
            x="0"
            y="0"
            width={gridMultiplier*gridSize}
            height={gridMultiplier*gridSize}
            patternUnits="userSpaceOnUse"
        >
            <circle
                id="coarse-dot"
                cx={gridSize / 2 - dotSize / 2}
                cy={gridSize / 2 - dotSize / 2}
                r="0.75"
                style={$themeStore === 'light' ? "fill: #222222" : "fill: white"}
            />
        </pattern>
    </defs>

    {#if $backgroundStore}
        <rect
            width="100%"
            height="100%"
            style="fill: url(#background-{canvasId});"
        />

        <rect
            width="100%"
            height="100%"
            style="fill: url(#coarse-background-{canvasId});"
        />
    {/if}

  <!-- <g> tag defines which edge type to render depending on properties of edge object -->
  <g>
    <BezierEdge canvasId={canvasId} source={[0, 0]} target={[100, 100]} animate/>




    <!-- {#each edges as edge}
        <SimpleBezierEdge edgeId={edge.id} {canvasId} />
    {/each}

    {#each tempEdges as temporaryEdge}
        <TemporaryEdge {temporaryEdge} />
    {/each} -->

    <!-- {#each anchors as anchor}
        <EdgeAnchor x={anchor.positionX} y={anchor.positionY} />
    {/each} -->
  </g>
</svg>


<style>
    .Nodes {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .Node {
        width: 100%;
        height: 100%;
    }

    #graphview-container {
        pointer-events: none;
    }

    .pointer-events-auto {
        pointer-events: auto;
    }
</style>
