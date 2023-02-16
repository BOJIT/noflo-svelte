/**
 * @file graphSync.ts
 * @author James Bennion-Pedley
 * @brief Store that keeps graph 'object' in sync with UI library
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import writableDerived from "svelte-writable-derived";

import type { GraphJson } from "$lib/middlewares/fbp-graph/Types";
import type {
    NodeType,
    StoreType,
} from "$lib/middlewares/svelvet/store/types/types";
import { Node } from "$lib/middlewares/svelvet/nodes/models/Node";

/*--------------------------------- State ------------------------------------*/

// TEMP
import { Settings } from "@svicons/ionicons-outline";
import type { FbpGraphNodeMetadata } from "$lib/types/Graph";

/*------------------------------- Functions ----------------------------------*/

function init(store: StoreType, canvasId: string) {

    /**
     * GraphJSON -> Node Map
     * @param g GraphJSON
     * @returns Node Map
     */
    function graphToNodes(g: GraphJson) : { [key: string]: NodeType } {
        const nodes: { [key: string]: NodeType } = {};

        if(g.processes === undefined)
            return nodes;

        for (const [key, val] of Object.entries(g.processes)) {
            if(val.metadata !== undefined) {
                const meta: FbpGraphNodeMetadata = val.metadata as FbpGraphNodeMetadata;
                const n = new Node(
                    key,
                    Settings,
                    val.component,
                    meta.label === undefined ? '' : meta.label,
                    meta.bgColor === undefined ? 'default' : meta.bgColor,
                    [],
                    [],

                    meta.x,
                    meta.y,
                    60,
                    60,
                    canvasId,
                    () => {}
                );

                nodes[key] = n;
            }
        }

        return nodes;
    };

    /**
     * Node Map -> GraphJSON
     * @param n Node Map
     * @param old Previous GraphJSON entry
     * @returns Updated GraphJSON
     */
    function nodesToGraph(n: { [key: string]: NodeType }, old: GraphJson) : GraphJson {
        // Clear existing keys
        old.processes = {};

        for (const [key, val] of Object.entries(n)) {
            const meta: FbpGraphNodeMetadata = {
                x: val.positionX,
                y: val.positionY,
                label: val.label,
            };

            old.processes[key] = {
                component: val.component,
                metadata: meta
            };
        }

        return old;
    }

    store.nodesStore = writableDerived(store.graphStore, graphToNodes, nodesToGraph);
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    init
};
