/**
 * @file colour.ts
 * @author James Bennion-Pedley
 * @brief Utilities for manipulating colour values
 * @date 04/04/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

/*------------------------------- Functions ----------------------------------*/

function colourShade(colour: string, percent: number) {
    let colStr: string = '#';
    for (let i = 0; i < 3; i++) {
        let chan = parseInt(colour.substring(2 * i + 1, 2 * i + 3), 16);
        chan = (chan * (100 + percent)) / 100;
        chan = Math.round(chan < 255 ? chan : 255);
        const chanStr = chan.toString(16).length == 1 ? "0" + chan.toString(16) : chan.toString(16);
        colStr = colStr.concat(chanStr);
    }

    return colStr;
}

/*-------------------------------- Exports -----------------------------------*/

export { colourShade };
