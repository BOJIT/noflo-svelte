/**
 * @file util.ts
 * @author James Bennion-Pedley
 * @brief Utilities for interacting with Nodes
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { get } from 'svelte/store';
import type { StoreType } from '../../store/types/types';

import { Help } from "@svicons/ionicons-outline";

import { Node } from "$lib/middlewares/svelvet/nodes/models/Node";

/*--------------------------------- State ------------------------------------*/

/*------------------------------- Functions ----------------------------------*/

/**
 * getNodeById will look for the targeted Node that has the same id provided in the Svelvet component store.
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param id The id of the targeted Node
 * @returns The targeted Node object in store.nodesStore
 */
function getNodeById(store: StoreType, id: string) {
    const nodesStore = get(store.nodesStore);
    const node = nodesStore[id];
    return node;
}

/**
 *
 * @param store The Svelvet store containing the state of a Svelvet component
 * @param component Type of component to add
 * @returns true on success, false on failure
 */
function addNodeToStore(store: StoreType, canvasId: string, component: string) : boolean {
    const loader = get(store.loaderStore);
    const c = loader(component);
    if(!c)
        return false;

    // Generate unique ID and add to store
    const nodesStore = get(store.nodesStore);

        /* Generate random ID then check that it is unique for the graph */
    let id = Math.round(Math.random() * 100000).toString(36);
    while(Object.keys(nodesStore).some((node) => node === id)) {
        id = Math.round(Math.random() * 100000).toString(36);
    }

    let cExpand = (Math.max(c.inPorts.length, c.outPorts.length) - 3);
    const n = new Node(
        id,
        c.icon === undefined ? Help : c.icon,
        component,
        component,
        'default',
        c.inPorts,
        c.outPorts,
        0,
        0,
        cExpand > 0 ? 60 + cExpand*17.5 : 60,
        60,
        canvasId,
        () => {}
    );

    store.nodesStore.update((ns) => {
        ns[id] = n;
        return ns;
    })

    return true;
}

/*-------------------------------- Exports -----------------------------------*/

export {
    getNodeById,
    addNodeToStore,
}
