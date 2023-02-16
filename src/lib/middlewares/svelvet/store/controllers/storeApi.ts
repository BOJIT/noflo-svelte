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

import { stores } from '../models/store';
import { writable, get } from 'svelte/store';

import type { StoreType, UserNodeType, UserEdgeType } from '../types/types';
import {
    populateAnchorsStore,
    populateNodesStore,
    populateEdgesStore,
    populatePotentialAnchorStore,
} from './util';

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
        nodesStore: writable({}),
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
        temporaryEdgeStore: writable([]),
        nodeCreate: writable(false), // this option sets whether the "nodeEdit" feature is enabled
        themeStore: writable('dark'),
    };
    return stores[canvasId];
}


/**
 * populateSvelvetStoreFromUserInput will populate all the states and set these states into the Svelvet store initialized by invoking createStoreEmpty
 *
 * @param canvasId The canvasId of the Svelvet component you are creating a store for
 * @param nodes This is an array of objects containing node info that is defined by the user. NOTE THAT THE STRUCTURE DIFFERS FROM THE NODES CLASS. The whole point of populateSvelvetStoreFromUserInput is to convert nodes into proper Svelvet Node objects. An example of nodes is in $routes/testingplayground/index.svelte
 * @param edges Same as nodes, this is an array of objects containing edge info THAT IS DIFFERENT FROM THE EDGE CLASS.
 */
function populateSvelvetStoreFromUserInput(
    canvasId: string,
    nodes: UserNodeType[],
    edges: UserEdgeType[]
  ): void {
    // find the store
    const store = findStore(canvasId);

    // populate store.nodesStore with user nodes
    populateNodesStore(store, nodes, canvasId);
    // populate store.anchorsStore with anchors. Note the userdoes not explictly define anchors; anchors are calculated from the edges
    populateAnchorsStore(store, nodes, edges, canvasId);
    // populate edges
    populateEdgesStore(store, edges, canvasId);
    //populate potential anchors if "node create" feature is turned on
    if (get(store.nodeCreate))
        populatePotentialAnchorStore(store, nodes, canvasId);
}

/*-------------------------------- Exports -----------------------------------*/

export { findStore, createStoreEmpty, populateSvelvetStoreFromUserInput };
