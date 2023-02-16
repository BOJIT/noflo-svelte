/**
 * @file store.ts
 * @author James Bennion-Pedley
 * @brief Central store collection for a given canvas
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import type { StoreType } from '../types/types';

/*--------------------------------- State ------------------------------------*/

/**
  `store` is a dictionary of Svelvet stores.
    * The reason why we have multiple Svelvet stores is to handle multiple canvases on the same page.
    * A Svelvet store is the single source of truth for a canvas state.
    * We discourage developers from interacting with stores directly; instead use the api methods in
      `src/lib/controllers/storeApi.ts`. However, if need to direct access you can do so by importing:
      `import { store } from 'src/lib/models/store';`
*/
const stores: { [key: string]: StoreType } = {};

/*------------------------------- Functions ----------------------------------*/

/*-------------------------------- Exports -----------------------------------*/

export { stores };