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

import { get } from "svelte/store";

import writableDerived from "svelte-writable-derived";
import { Help } from "@svicons/ionicons-outline";

import type { GraphJson } from "$lib/middlewares/fbp-graph/Types";
import type { FbpGraphNodeMetadata } from "$lib/types/FbpGraph";

import type { FbpEdgeType, FbpNodeType } from "$lib/types/FbpGraph";
import type { NofloStore } from "$lib/types/Noflo";

import { Node } from "$lib/middlewares/svelvet/nodes/models/Node";

/*--------------------------------- State ------------------------------------*/


/*------------------------------- Functions ----------------------------------*/

function init(store: NofloStore, canvasId: string) {

    /**
     * GraphJSON -> Node Map
     * @param g GraphJSON
     * @returns Node Map
     */
    function graphToNodes(g: GraphJson): { [key: string]: FbpNodeType } {
        const nodes: { [key: string]: FbpNodeType } = {};

        const loader = get(store.loaderStore);

        if (g.processes === undefined)
            return nodes;

        for (const [key, val] of Object.entries(g.processes)) {
            const c = loader(val.component);

            if (c && val.metadata !== undefined) {
                let cExpand = (Math.max(c.inPorts.length, c.outPorts.length) - 3);

                const meta: FbpGraphNodeMetadata = val.metadata as FbpGraphNodeMetadata;
                const n = new Node(
                    key,
                    c.icon === undefined ? Help : c.icon,
                    val.component,
                    meta.label === undefined ? '' : meta.label,
                    meta.bgColor === undefined ? 'default' : meta.bgColor,
                    c.inPorts,
                    c.outPorts,
                    meta.x,
                    meta.y,
                    cExpand > 0 ? 60 + cExpand * 17.5 : 60,
                    60,
                    canvasId,
                    () => { }
                );

                nodes[key] = n;
            }
            // TODO handle error if component could not be loaded
        }

        return nodes;
    };

    /**
     * Node Map -> GraphJSON
     * @param n Node Map
     * @param old Previous GraphJSON entry
     * @returns Updated GraphJSON
     */
    function nodesToGraph(n: { [key: string]: FbpNodeType }, old: GraphJson): GraphJson {
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

    /**
     * GraphJSON -> Edge Map
     * @param g GraphJSON
     * @returns Node Map
     */
    function graphToEdges(g: GraphJson): { [key: string]: FbpEdgeType } {
        const edges: { [key: string]: FbpEdgeType } = {};

        if (g.connections === undefined)
            return edges;

        // TODO: Bodge, need to fix
        g.connections.forEach((c, i) => {
            edges[i.toString()] = {
                sourceNode: c.src?.process,
                sourcePort: c.src?.port,
                targetNode: c.tgt.process,
                targetPort: c.tgt.port,

                canvasId: canvasId,
                type: 'bezier',
                animate: false,
            }
        })

        return edges;
    };

    /**
     * Node Map -> GraphJSON
     * @param n Node Map
     * @param old Previous GraphJSON entry
     * @returns Updated GraphJSON
     */
    function edgesToGraph(n: { [key: string]: FbpEdgeType }, old: GraphJson): GraphJson {
        // Clear existing keys
        old.connections = [];

        for (const [key, val] of Object.entries(n)) {
            old.connections.push({
                src: { process: val.sourceNode, port: val.sourcePort },
                tgt: { process: val.targetNode, port: val.targetPort },
            })
        }

        return old;
    }

    store.nodesStore = writableDerived(store.graphStore, graphToNodes, nodesToGraph);
    store.edgesStore = writableDerived(store.graphStore, graphToEdges, edgesToGraph);
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    init
};
