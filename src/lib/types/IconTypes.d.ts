/**
 * @file IconTypes.d.ts
 * @author James Bennion-Pedley
 * @brief Custom types relating to the Icon Library objects
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*----------------------------------- Types ----------------------------------*/

export type Icon = {
    name: string,
    icon: string,
    description?: string,
    inports: Object[],
    outports: Object[],
}

export type IconLibrary = {
    [key: string]: Icon
}
