/**
 * @file d3.ts
 * @author James Bennion-Pedley
 * @brief D3 core handler code
 * @date 16/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

import { get } from 'svelte/store';

/*------------------------------- Functions ----------------------------------*/

function d3ZoomInit(
    d3,
    canvasId,
    d3Zoom,
    d3Translate,
    initialLocation,
    initialZoom,
    d3Scale
) {
    //set default zoom logic
    d3.select(`.Edges-${canvasId}`)
        //makes sure translation is default at center coordinates
        .transition()
        .duration(0)
        .call(d3Zoom.translateTo, 0, 0)
        //moves camera to coordinates
        .transition()
        .duration(0)
        .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
        // zooms in on selected point
        .transition()
        .duration(0)
        .call(d3Zoom.scaleBy, (0.4 + 0.16 * initialZoom).toFixed(2));

    // updates d3Translate with d3 object with x, y, and k values to be sent down to the minimap to be further calculated further
    d3Translate = d3.zoomIdentity
        .translate(initialLocation.x, initialLocation.y)
        .scale((0.4 + 0.16 * initialZoom).toFixed(2));

    d3.select(`.Nodes-${canvasId}`)
        .transition()
        .duration(0)
        .call(d3Zoom.translateTo, 0, 0)
        .transition()
        .duration(0)
        .call(d3Zoom.translateTo, initialLocation.x, initialLocation.y)
        .transition()
        .duration(0)
        .call(d3Zoom.scaleBy, (0.4 + 0.16 * initialZoom).toFixed(2));

    // sets D3 scale to current k of object
    d3Scale.set(d3.zoomTransform(d3.select(`.Nodes-${canvasId}`)).k);

    return d3Translate;
}

function d3DetermineInstance(
    d3,
    nodeSelected,
    handleZoom
) {
    return d3
        .zoom()
        .filter((e: any) => {
            return !get(nodeSelected);
            // return !(get(nodeSelected) && e.sourceEvent?.constructor.name === 'MouseEvent')
        })
        .scaleExtent([0.2, 10])
        .on('zoom', handleZoom);
}

/*-------------------------------- Exports -----------------------------------*/

export { d3ZoomInit, d3DetermineInstance };
