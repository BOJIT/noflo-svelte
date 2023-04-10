/**
 * @file Noflo.d.ts
 * @author James Bennion-Pedley
 * @brief Global NoFlo definitions
 * @date 04/04/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { Writable } from 'svelte/store';

import type { GraphJson } from "$lib/middlewares/fbp-graph/Types";
import type { AnchorType } from '../../edges/types/types';
import type { NofloComponentLoader } from "$lib/types/Component";

/*--------------------------------- Types ------------------------------------*/

export type NofloTheme = 'light' | 'dark';
export type NofloMinimap = 'none' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface NofloStore {
    // Global
    graphStore: Writable<GraphJson>;
    loaderStore: Writable<NofloComponentLoader>;
    themeStore: Writable<NofloTheme>;

    nodesStore: Writable<{ [key: string]: NodeType }>;
    edgesStore: Writable<{ [key: string]: EdgeType }>;

    // Context
    widthStore: Writable<number>;
    heightStore: Writable<number>;
    backgroundStore: Writable<boolean>;

    // Editor
    edgeCandidateStore: Writable<EdgeCandidate>;

    // Runtime State
    d3Scale: Writable<number>; // for zoom and pan
    nodeIdSelected: Writable<number>;
    nodeSelected: Writable<boolean>; // this is used to stop d3 panning when node is being dragged TODO fix!
}

/*-------------------------------- Exports -----------------------------------*/
