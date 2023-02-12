/**
 * @file index.ts
 * @author James Bennion-Pedley
 * @brief Entry point for library
 * @date 12/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import Noflo from "$lib/Noflo.svelte";

import Graph from "$lib/fbp-graph";
import type { GraphJson } from "$lib/fbp-graph/Types";

/*--------------------------------- State ------------------------------------*/

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export { Graph as FbpGraph }
export type { GraphJson as FbpGraphJson };

export default Noflo;

// TODO export:
/*
- Component Type
*/
