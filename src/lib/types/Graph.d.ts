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

// import type { GraphJson } from "/middlewares/fbp-graph/Types";

/*-------------------------------- Exports -----------------------------------*/

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
