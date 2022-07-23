/**
 * @file merge.js
 * @author James Bennion-Pedley
 * @brief ES6 port of a simple property merger
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*------------------------------ Implementation ------------------------------*/

function merge(src, dest, overwrite) {
    // Do nothing if neither are true objects.
    if (Array.isArray(src) || Array.isArray(dest) || typeof src !== 'object' || typeof dest !== 'object') return dest;

    // Default overwriting of existing properties to false.
    overwrite = overwrite || false;

    Object.keys(src).forEach((key) => {
        // Only copy properties, not functions.
        if (typeof src[key] !== 'function' && (!dest[key] || overwrite)) {
        dest[key] = src[key];
        }
    });

    return dest;
};

/*----------------------------------------------------------------------------*/

export default merge;
