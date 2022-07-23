// Top level imports
import Ease from 'ease-component';

/*----------------------------------------------------------------------------*/
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

TheGraph.factories = import('./the-graph/factories.js');
TheGraph.merge = import('./the-graph/merge.js');

import('./the-graph/the-graph-app.js').register(g);
import('./the-graph/the-graph-graph.js').register(g);
import('./the-graph/the-graph-node.js').register(g);
import('./the-graph/the-graph-node-menu.js').register(g);
import('./the-graph/the-graph-node-menu-port.js').register(g);
import('./the-graph/the-graph-node-menu-ports.js').register(g);
import('./the-graph/the-graph-port.js').register(g);
import('./the-graph/the-graph-edge.js').register(g);
import('./the-graph/the-graph-iip.js').register(g);
import('./the-graph/the-graph-group.js').register(g);

TheGraph.menu = import('./the-graph/the-graph-menu.js');
// compat
TheGraph.Menu = TheGraph.menu.Menu;
TheGraph.factories.menu = TheGraph.menu.factories;
TheGraph.config.menu = TheGraph.menu.config;
TheGraph.config.menu.iconRect.rx = TheGraph.config.nodeRadius;
TheGraph.config.menu.iconRect.ry = TheGraph.config.nodeRadius;

TheGraph.modalbg = import('./the-graph/the-graph-modalbg.js');
// compat
TheGraph.ModalBG = TheGraph.modalbg.ModalBG;
TheGraph.config.ModalBG = TheGraph.config.factories;
TheGraph.factories.ModalBG = TheGraph.modalbg.factories;

TheGraph.FONT_AWESOME = import('./the-graph/font-awesome-unicode-map.js');

const geometryutils = import('./the-graph/geometryutils');
// compat
TheGraph.findMinMax = geometryutils.findMinMax;
TheGraph.findNodeFit = geometryutils.findNodeFit;
TheGraph.findFit = geometryutils.findFit;

TheGraph.tooltip = import('./the-graph/the-graph-tooltip.js');
// compat
TheGraph.Tooltip = TheGraph.tooltip.Tooltip;
TheGraph.config.tooltip = TheGraph.tooltip.config;
TheGraph.factories.tooltip = TheGraph.tooltip.factories;

TheGraph.mixins = import('./the-graph/mixins.js');
TheGraph.arcs = import('./utils/arcs.js');

TheGraph.TextBG = import('./the-graph/TextBG.js');
TheGraph.SVGImage = import('./the-graph/SVGImage.js');

TheGraph.thumb = import('./the-graph-thumb/the-graph-thumb.js.js.js');

TheGraph.nav = import('./the-graph-nav/the-graph-nav.js.js.js');

TheGraph.autolayout = import('./the-graph/the-graph-autolayout.js');
TheGraph.library = import('./the-graph/the-graph-library.js');

TheGraph.clipboard = import('./the-graph-editor/clipboard.js.js.js');

TheGraph.render = import('./the-graph/render.js');

TheGraph.render.register(g);

export default TheGraph;
