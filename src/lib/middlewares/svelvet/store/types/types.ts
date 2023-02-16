/**
 * @file types.ts
 * @author James Bennion-Pedley
 * @brief Svelvet Library Types
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { SvelteComponent } from "svelte";
import type { Writable } from 'svelte/store';

import type { GraphJson } from "$lib/middlewares/fbp-graph/Types";
import type { AnchorType } from '../../edges/types/types';
import type { NofloComponentLoader } from "$lib/types/Component";

/*-------------------------------- Exports -----------------------------------*/

export interface UserEdgeType {
    id: string;
    source: string;
    target: string;
    sourceAnchorCb?: Function;
    targetAnchorCb?: Function;
    label?: string;
    labelBgColor?: string;
    labelTextColor?: string;
    edgeColor?: string;
    type?: 'straight' | 'smoothstep' | 'step' | 'bezier' | undefined;
    animate?: boolean;
    noHandle?: boolean;
    arrow?: boolean;
    clickCallback?: Function;
    className?: string;
}

/*
Type for a single svelvet store
*/
export interface StoreType {
    graphStore: Writable<GraphJson>;
    loaderStore: Writable<NofloComponentLoader>;
    themeStore: Writable<NofloTheme>;

    nodesStore: Writable<{ [key: string]: NodeType }>;
    edgesStore: Writable<{ [key: string]: EdgeType }>;
    anchorsStore: Writable<{ [key: string]: AnchorType }>;
    potentialAnchorsStore: Writable<{ [key: string]: PotentialAnchorType }>;

    widthStore: Writable<number>;
    heightStore: Writable<number>;
    backgroundStore: Writable<boolean>;
    movementStore: Writable<boolean>;
    nodeIdSelected: Writable<number>;
    nodeSelected: Writable<boolean>; // this is used to stop d3 panning when node is being dragged TODO fix!
    d3Scale: Writable<number>; // for zoom and pan
    options: Writable<{ [key: string]: any }>;
    temporaryEdgeStore: Writable<TemporaryEdgeType[]>;
    nodeCreate: Writable<boolean>; // this option sets whether the "nodeEdit" feature is enabled
}

export interface PositionType {
    x: number;
    y: number;
}

export interface NodeType {
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

export interface EdgeType {
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

export interface PotentialAnchorType {
    id: string;
    nodeId: string;
    callback: Function; // callback is used to calculate positionX, positionY based on parent node's data, and set the anchor position // TODO: rename to something better
    positionX: number;
    positionY: number;
    angle: number;
    canvasId: string;
    delete: Function;
}

export interface TemporaryEdgeType {
    id: string;
    sourcePotentialAnchorId: string; // this will always be set
    sourceX: number;
    sourceY: number;
    targetPotentialAnchorId: string | null; // this will be null until the temporary edge reaches another temporary anchor
    targetX: number;
    targetY: number;
    canvasId: string;
    type: string;
    edgeColor: string;
    createEdge: Function;
    createNode: Function;
}

// Additional types

export type NofloTheme = 'light' | 'dark';
export type NofloMinimap = 'none' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
