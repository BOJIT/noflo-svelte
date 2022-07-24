/**
 * @file index.js
 * @author James Bennion-Pedley
 * @brief New ES6 entry point for TheGraph
 * @date 24/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */


/*---------------------------------- Imports ---------------------------------*/

import Ease from 'ease-component';

/*------------------------------ Implementation ------------------------------*/

const TheGraph = {};

// Pull in Ease from NPM, react.animate needs it as a global
TheGraph.Ease = Ease;

if (typeof window !== 'undefined' && typeof window.Ease === 'undefined') {
    window.Ease = TheGraph.Ease;
}

const defaultNodeSize = 72;
const defaultNodeRadius = 8;

const moduleVars = {
    // Context menus
    contextPortSize: 36,
    // Zoom breakpoints
    zbpBig: 1.2,
    zbpNormal: 0.4,
    zbpSmall: 0.01,
    config: {
        nodeSize: defaultNodeSize,
        nodeWidth: defaultNodeSize,
        nodeRadius: defaultNodeRadius,
        nodeHeight: defaultNodeSize,
        autoSizeNode: true,
        maxPortCount: 9,
        nodeHeightIncrement: 12,
        focusAnimationDuration: 1500,
    },
};
Object.keys(moduleVars).forEach((key) => {
    TheGraph[key] = moduleVars[key];
});

if (typeof window !== 'undefined') {
    // rAF shim
    window.requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.msRequestAnimationFrame;
}

// HACK, goes away when everything is CommonJS compatible
const g = { TheGraph };

/*----------------------------------- Utils ----------------------------------*/

import factories from './utils/factories';
TheGraph.factories = factories;

import merge from './utils/merge';
TheGraph.merge = merge;

import FONT_AWESOME from './utils/font-awesome-unicode-map';
TheGraph.FONT_AWESOME = FONT_AWESOME;

import geometryutils from './utils/geometryutils';
TheGraph.findMinMax = geometryutils.findMinMax;
TheGraph.findNodeFit = geometryutils.findNodeFit;
TheGraph.findFit = geometryutils.findFit;

import mixins from './utils/mixins';
TheGraph.mixins = mixins;

import arcs from './utils/arcs';
TheGraph.arcs = arcs;

import TextBG from './utils/TextBG';
TheGraph.TextBG = TextBG;

import SVGImage from './utils/SVGImage';
TheGraph.SVGImage = SVGImage;

import library from './utils/library';
TheGraph.library = library;

/*------------------------------------ UI ------------------------------------*/

TheGraph.App = null;
import app from './components/the-graph-app'; app.register(g);
import graph from './components/the-graph-graph'; graph.register(g);
import node from './components/the-graph-node'; node.register(g);
import nodeMenu from './components/the-graph-node-menu'; nodeMenu.register(g);
import nodeMenuPort from './components/the-graph-node-menu-port'; nodeMenuPort.register(g);
import nodeMenuPorts from './components/the-graph-node-menu-ports'; nodeMenuPorts.register(g);
import port from './components/the-graph-port'; port.register(g);
import edge from './components/the-graph-edge'; edge.register(g);
import iip from './components/the-graph-iip'; iip.register(g);
import group from './components/the-graph-group'; group.register(g);

import menu from './components/the-graph-menu';
TheGraph.menu = menu;
// compat
TheGraph.Menu = TheGraph.menu.Menu;
TheGraph.factories.menu = TheGraph.menu.factories;
TheGraph.config.menu = TheGraph.menu.config;
TheGraph.config.menu.iconRect.rx = TheGraph.config.nodeRadius;
TheGraph.config.menu.iconRect.ry = TheGraph.config.nodeRadius;

import modalbg from './components/the-graph-modalbg';
TheGraph.modalbg = modalbg;
// compat
TheGraph.ModalBG = TheGraph.modalbg.ModalBG;
TheGraph.config.ModalBG = TheGraph.config.factories;
TheGraph.factories.ModalBG = TheGraph.modalbg.factories;

import tooltip from './components/the-graph-tooltip';
TheGraph.tooltip = tooltip;
// compat
TheGraph.Tooltip = TheGraph.tooltip.Tooltip;
TheGraph.config.tooltip = TheGraph.tooltip.config;
TheGraph.factories.tooltip = TheGraph.tooltip.factories;

/*---------------------------------- Render ----------------------------------*/

import render from './utils/render';
TheGraph.render = render;
TheGraph.render.register(g);

/*----------------------------------------------------------------------------*/

export default TheGraph;
