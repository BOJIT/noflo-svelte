/**
 * @file storeApi.ts
 * @author James Bennion-Pedley
 * @brief Brief summary here
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { writable } from 'svelte/store';

import Graph from '$lib/middlewares/fbp-graph';

import { stores } from '../models/store';
import type { StoreType } from '../types/types';

import graphSync from '$lib/state/graphSync';

/*--------------------------------- State ------------------------------------*/

/*------------------------------- Functions ----------------------------------*/

/**
 * findStore is going to return the target Svelvet store with the canvasId provided as argument.
 * There can be multiple Svelvet canvases on the same page, and each has their own store with a unique canvasId.
 * @param canvasId The canvasId of a Svelvet component
 * @returns The store of a Svelvet component that matches the canvasId
 */
function findStore(canvasId: string): StoreType {
    return stores[canvasId];
}

/**
 * createStoreEmpty will initialize a new Svelvet store with a unique canvasId.
 * If you have multiple Svelvet components on the page, the stores object will look like the following example:
 * const stores = \{
 *                  canvasId-1: store of Svelvet component 1,
 *                  canvasId-2: store of Svelvet component 2,
 *                  canvasId-3: store of Svelvet component 3,
 *                \}
 * Notes: This should be called once every time you initialize a new Svelvet canvas, (ie, only in the Svelvet.svelte file).
 * This function will initialize an empty store for the Svelvet component and should be followed by invoking populateSvelvetStoreFromUserInput to populate all the initial state from the user input.
 *
 * @param canvasId The canvasId of the newly created Svelvet component
 * @returns An empty store for the newly created Svelvet component.
 */
function createStoreEmpty(canvasId: string): StoreType {
    stores[canvasId] = {
        graphStore: writable(new Graph.Graph().toJSON()),
        loaderStore: writable((key: string) => null),
        themeStore: writable('dark'),

        edgeCandidateStore: writable({
            source: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
            active: false,
        }),

        nodesStore: writable({}),   // Unused
        edgesStore: writable({}),
        anchorsStore: writable({}),
        potentialAnchorsStore: writable({}),
        widthStore: writable(600),
        heightStore: writable(600),
        backgroundStore: writable(false),
        movementStore: writable(true),
        nodeSelected: writable(false),
        nodeIdSelected: writable(-1),
        d3Scale: writable(1),
        options: writable({}),
        nodeCreate: writable(false), // this option sets whether the "nodeEdit" feature is enabled
    };

    // Initialise synchronised state
    graphSync.init(stores[canvasId], canvasId);

    return stores[canvasId];
}

/*-------------------------------- Exports -----------------------------------*/

export { findStore, createStoreEmpty };
