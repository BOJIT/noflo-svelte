/**
 * @file index.ts
 * @author James Bennion-Pedley
 * @brief Library Entry Point
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import Svelvet from './container/views/Svelvet.svelte';

import type {
    UserNodeType,
    UserEdgeType,
    NofloTheme,
    NofloMinimap,
} from './store/types/types';

/*-------------------------------- Exports -----------------------------------*/

export default Svelvet;

export type {
    UserNodeType,
    UserEdgeType,
    NofloTheme,
    NofloMinimap,
};
