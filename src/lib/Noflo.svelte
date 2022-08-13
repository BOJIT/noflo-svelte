<!--
 * @file Noflo.svelte
 * @author James Bennion-Pedley
 * @brief Main entry point for Noflo graph UI
 * @date 23/07/2022
 *
 * @note it is recommended to disable prerendering for pages using this component
 *
 * @copyright Copyright (c) 2022
 *
-->


<script lang="ts">
    /* Svelte Core */
    import { afterUpdate, onDestroy, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    /* Types */
    import type { IconLibrary } from '$lib/types/IconTypes';
    import type { ComponentLibrary } from '$lib/types/ComponentTypes';
    import type { Graph } from '$lib/fbp-graph/Graph';

    type SelectionData = {
        type: 'edge' | 'node' | null,
        target: string,
    }

    type State = {
        selection: SelectionData,
        canUndo: boolean,
        canRedo: boolean,
    }

    /* Stylesheets */
    import "$lib/themes/the-graph-fontawesome.css";
    import "$lib/themes/the-graph-dark.css";
    import "$lib/themes/the-graph-light.css";

    /* Core */
    import TheGraph from '$lib/the-graph';

    /* Third-Party */
    import FbpGraph from '$lib/fbp-graph';
    import ReactDOM from 'react-dom';

    /* Utils */
    import History from '$lib/utils/history';
    import generateIconLibrary from '$lib/utils/generateIconLibrary';


    /* Internal State */
    let app: any;
    let container: HTMLElement;
    let iconLibrary: IconLibrary;
    let history: History | null = null;

    /* Public Interface */
    export let library: ComponentLibrary;
    export let graph: Graph = new FbpGraph.Graph();
    export let theme: "light" | "dark" = "dark";

    $: iconLibrary = generateIconLibrary(library);

    export let state: State = {
        selection: {
            type: null,
            target: '',
        },
        canUndo: false,
        canRedo: false,
    }

    /*------------------------------- Callbacks ------------------------------*/

    /* Handle component selection */
    function nodeSelectedCallback(id: string) {
        if(id === undefined) {
            app.refs.graph.setSelectedNodes({});
            state.selection.type = null;
            state.selection.target = '';
        } else {
            let sel: any = {};
            sel[id] = true;
            app.refs.graph.setSelectedEdges([]);
            app.refs.graph.setSelectedNodes(sel);
            state.selection.type = 'node';
            state.selection.target = id;
        }
    }

    /* Handle edge selection */
    function edgeSelectedCallback(id: any, edge:any) {
        if(id === undefined) {
            app.refs.graph.setSelectedEdges([]);
            state.selection.type = null;
            state.selection.target = '';
        } else {
            let sel: any[] = [];
            sel[0] = edge;
            app.refs.graph.setSelectedNodes({});
            app.refs.graph.setSelectedEdges(sel);
            state.selection.type = 'edge';
            state.selection.target = edge;
        }
    }

    /*------------------------------ React State -----------------------------*/

    function addGraphHooks() {
        graph.on('startTransaction', () => {
            /* Ensure initial state is in history */
            if(history === null) { history = new History(graph, 10) }
        });

        graph.on('endTransaction', () => {
            history?.save(graph);
            render(false)
            dispatch('graphChange');
        });
    }

    function render(redraw: boolean) {
        const props = {
            readonly: false,
            height: window.innerHeight,
            width: window.innerWidth,
            graph,
            library: iconLibrary,
            enableHotKeys: false,
            onNodeSelection: nodeSelectedCallback,
            onEdgeSelection: edgeSelectedCallback,
        };

        /* If redraw is set to true, clear out and re-render the editor */
        if(redraw === true) {
            if(container != null) {
                if(typeof window !== 'undefined')
                    ReactDOM.unmountComponentAtNode(container);
            }
        }

        if(typeof window !== 'undefined')
            app = ReactDOM.render(TheGraph.App(props), container);
    }

    /*-------------------------------- Lifecycle -----------------------------*/

    onMount(() => {
        /* Initialise new graph with no history */
        addGraphHooks();

        render(true);

        window.addEventListener('resize', () => render(true));
    })

    afterUpdate(() => {
        // klayjsInit(workerURL);
        render(false);
    });

    onDestroy(() => {
        if(typeof window !== 'undefined')
            ReactDOM.unmountComponentAtNode(container);
    });

    /*-------------------------------- Helpers -------------------------------*/

    /* Add component to graph and UI */
    function addNode(key: string) {
        /* Generate random ID then check that it is unique for the graph */
        let id = Math.round(Math.random() * 100000).toString(36);
        while(graph.nodes.some((node) => node.id === id)) {
            id = Math.round(Math.random() * 100000).toString(36);
        }

        /* Place in stack if place is taken */
        let increment = 0;
        while(graph.nodes.some((node) => node.metadata?.x ===
                                        (window.innerWidth/2 + increment))) {
            increment += 20;
        }

        const metadata = {
            label: key,
            x: window.innerWidth/2 + increment,
            y: window.innerHeight/2 + increment,
        };

        graph.addNode(id, key, metadata);

        /* Reset any component selections */
        app.unselectAll();
    };

    /* Expose function API */
    export const API = {
        addNode,
        removeNode: (id: string) => {
            app.unselectAll();
            graph.removeNode(id);
        },
        removeEdge: (edge: any) => {
            app.unselectAll();
            graph.removeEdge(edge.from.node, edge.from.port,
                             edge.to.node,   edge.to.port);
        },
        // autolayoutGraph,
        recentreGraph: () => {
            app.triggerFit();
        },
        clearGraph: () => {
            graph = new FbpGraph.Graph();
            addGraphHooks();
        },
        clearHistory: () => {
            history = new History(graph, 10);
        },
        undo: async () => {
            if(history?.canUndo) {
                let g = await history.undo();
                if(g !== undefined) { graph = g; }
            }
        },
        redo: async () => {
            if(history?.canRedo) {
                let g = await history.redo();
                if(g !== undefined) { graph = g; }
            }
        }
    }
</script>


<div bind:this={container} class:the-graph-dark="{theme === "dark"}"
                           class:the-graph-light="{theme === "light"}" />

