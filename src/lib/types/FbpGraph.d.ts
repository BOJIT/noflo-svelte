/**
 * @file Graph.d.ts
 * @author James Bennion-Pedley
 * @brief Specification for a Graph Object
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { SvelteComponent } from "svelte";

// import type { GraphJson } from "/middlewares/fbp-graph/Types";

/*-------------------------------- Exports -----------------------------------*/

export interface FbpPositionType {
    x: number;
    y: number;
}

export interface FbpNodeType {
    // Must be set
    id: string;
    icon: SvelteComponent;
    component: string;
    label: string;
    bgColor: string;
    inPorts: string[];
    outPorts: string[];

    // Derived
    positionX: number;
    positionY: number;
    height: number;
    width: number;
    canvasId: string;

    setPositionFromMovement: Function;
    delete: Function; //This is the method to delete the node from the store
    clickCallback: Function; // user-supplied callback that executes when the node is clicked
}

export interface FbpEdgeType {
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    canvasId: string;
    label: string;
    type: 'straight' | 'smoothstep' | 'step' | 'bezier';
    labelBgColor: string;
    labelTextColor: string;
    edgeColor: string;
    animate: boolean;
    noHandle: boolean;
    arrow: boolean;
    clickCallback: Function;
    className: string;
    delete: Function;
}

export type FbpGraphPortConfig = {
    type: 'thru' | 'enum' | 'constant',
    init?: object | number | string
};

export type FbpGraphNodeSettings = {
    description?: string
    inport: {
        [key: string]: FbpGraphPortConfig,
    }
    outport: {
        [key: string]: FbpGraphPortConfig,
    }
};

export type FbpGraphNodeMetadata = {
    x: number
    y: number
    label?: string
    bgColor?: string
    settings?: FbpGraphNodeSettings
};
