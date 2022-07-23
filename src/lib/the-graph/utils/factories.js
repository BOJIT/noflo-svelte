/**
 * @file factories.js
 * @author James Bennion-Pedley
 * @brief ES6 port of factories
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';
import SVGImage from './SVGImage';

/*------------------------------ Implementation ------------------------------*/

// Standard functions for creating SVG/HTML elements
function createGroup(options, content) {
    let args = ['g', options];

    if (Array.isArray(content)) {
        args = args.concat(content);
    }

    return React.createElement(...args);
};

function createRect(options) {
    return React.createElement('rect', options);
};

function createText(options) {
    return React.createElement('text', options);
};

function createCircle(options) {
    return React.createElement('circle', options);
};

function createPath(options) {
    return React.createElement('path', options);
};

function createPolygon(options) {
    return React.createElement('polygon', options);
};

function createImg(options) {
    return SVGImage(options);
};

function createCanvas(options) {
    return React.createElement('canvas', options);
};

function createSvg(options, content) {
    let args = ['svg', options];

    if (Array.isArray(content)) {
        args = args.concat(content);
    }

    return React.createElement(...args);
};

/*----------------------------------------------------------------------------*/

export default {
    createGroup,
    createRect,
    createText,
    createCircle,
    createPath,
    createPolygon,
    createImg,
    createCanvas,
    createSvg
}
