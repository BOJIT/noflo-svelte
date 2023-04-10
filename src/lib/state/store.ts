/**
 * @file store.ts
 * @author James Bennion-Pedley
 * @brief Central store for each Noflo Graph instance
 * @date 04/04/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable } from 'svelte/store';

import Graph from '$lib/middlewares/fbp-graph';

import type { NofloStore } from '$lib/types/Noflo';

import graphSync from '$lib/state/graphSync'; // TODO merge here???

/*--------------------------------- State ------------------------------------*/

/**
  `store` is a dictionary of Svelvet stores.
    * The reason why we have multiple Svelvet stores is to handle multiple canvases on the same page.
    * A Svelvet store is the single source of truth for a canvas state.
*/
const stores: { [key: string]: NofloStore } = {};

/*------------------------------- Functions ----------------------------------*/

/**
 * findStore is going to return the target Svelvet store with the canvasId provided as argument.
 * There can be multiple Svelvet canvases on the same page, and each has their own store with a unique canvasId.
 * @param canvasId The canvasId of a Svelvet component
 * @returns The store of a Svelvet component that matches the canvasId
 */
function storeGetInstance(canvasId: string): NofloStore {
    return stores[canvasId];
}

/**
 * createStoreEmpty will initialize a new Svelvet store with a unique canvasId.

 * @param canvasId The canvasId of the newly created Svelvet component
 * @returns An empty store for the newly created Svelvet component.
 */
function storeCreateInstance(canvasId: string): NofloStore {
    stores[canvasId] = {
        graphStore: writable(new Graph.Graph().toJSON()),
        loaderStore: writable((key: string) => null),
        themeStore: writable('dark'),

        edgeCandidateStore: writable({
            source: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
            active: false,
        }),

        nodesStore: writable({}),
        edgesStore: writable({}),

        widthStore: writable(600),
        heightStore: writable(600),
        backgroundStore: writable(false),
        nodeSelected: writable(false),
        nodeIdSelected: writable(-1),
        d3Scale: writable(1),
    };

    // Initialise synchronised state
    graphSync.init(stores[canvasId], canvasId);

    return stores[canvasId];
}

/*-------------------------------- Exports -----------------------------------*/

export { stores, storeGetInstance, storeCreateInstance };
