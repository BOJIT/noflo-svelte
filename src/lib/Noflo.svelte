<!--
 * @file Noflo.svelte
 * @author James Bennion-Pedley
 * @brief Main entry point for Noflo graph UI
 * @date 23/07/2022
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
    import type { IconLibrary } from './types/IconTypes';
    import type { ComponentLibrary } from '$lib/types/ComponentTypes';
    import type { Graph } from '$lib/fbp-graph/Graph';

    /* Core */
    import TheGraph from '$lib/the-graph';

    /* Third-Party */
    import FbpGraph from '$lib/fbp-graph';
    import ReactDOM from 'react-dom';

    /* Utils */
    import History from '$lib/utils/history';
    import generateIconLibrary from '$lib/utils/generateIconLibrary';

    let app: any;

    /* Internal State */
    let container: HTMLElement;
    let iconLibrary: IconLibrary;
    let history: History | null = null;

    /* Public Interface */
    export let library: ComponentLibrary;
    export let graph: Graph = new FbpGraph.Graph();
    export let theme: "light" | "dark" = "dark";

    $: iconLibrary = generateIconLibrary(library);

    export let state = {
        selected: "",
        canUndo: false,
        canRedo: false
    }

    /*------------------------------------------------------------------------*/

    /* Handle component selection */
    function nodeSelectedCallback(key: string) {
        if(key === undefined) {
            app.refs.graph.setSelectedNodes({});
            state.selected = "";
        } else {
            let sel: any = {};
            sel[key] = true;
            app.refs.graph.setSelectedNodes(sel);
            state.selected = key;
        }
    }

    /* Handle edge selection */
    function edgeSelectedCallback(key: string) {
        // TODO implement edge selection
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
            onEdgeSelection: (() => {}),
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
    function addComponent(key: string) {
        /* Generate random ID then check that it is unique for the graph */
        let id = Math.round(Math.random() * 100000).toString(36);
        while(graph.nodes.some((node) => node.id === id)) {
            id = Math.round(Math.random() * 100000).toString(36);
        }

        const component = library[key];

        /* Place in stack if place is taken */
        let increment = 0;
        while(graph.nodes.some((node) => node.metadata.x ===
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

    /* Remove component from graph and UI */
    function removeComponent(id: string) {
        /* Reset any component selections */
        app.unselectAll();

        graph.removeNode(id);
    }

    /* Expose function API */
    export const API = {
        addComponent,
        removeComponent,
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
