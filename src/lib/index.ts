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

import Graph from "$lib/middlewares/fbp-graph";
import type { GraphJson } from "$lib/middlewares/fbp-graph/Types";

import type {
    NofloTheme,
    NofloMinimap,
} from "$lib/middlewares/svelvet/store/types/types";

/*--------------------------------- State ------------------------------------*/

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export { Graph as FbpGraph }
export type { GraphJson as FbpGraphJson };

export type {
    NofloTheme,
    NofloMinimap,
};

export default Noflo;
