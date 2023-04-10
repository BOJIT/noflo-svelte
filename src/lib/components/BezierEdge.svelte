<!--
 * @file BezierEdge.svelte
 * @author James Bennion-Pedley
 * @brief Store-less Bezier Edge
 * @date 27/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import BaseEdge from "./BaseEdge.svelte";
    import type { FbpPositionType } from "$lib/types/FbpGraph";

    /*--------------------------------- Props --------------------------------*/

    export let animate: boolean = false;

    export let source: FbpPositionType;
    export let target: FbpPositionType;

    export let canvasId: string;

    let params = {
        sourceX: source.x,
        sourceY: source.y,
        sourcePosition: "left",
        targetX: target.x,
        targetY: target.y,
        targetPosition: "right",
        curvature: 0.25,
    };

    /*-------------------------------- Methods -------------------------------*/

    function calculateControlOffset(distance, curvature) {
        if (distance >= 0) {
            return 0.5 * distance;
        } else {
            return curvature * 25 * Math.sqrt(-distance);
        }
    }

    // get the control point for the bezier curve (in the middle of the edge)
    function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
        let ctX = 0,
            ctY = 0;
        switch (pos) {
            case "right":
                {
                    ctX = x1 - calculateControlOffset(x1 - x2, c);
                    ctY = y1;
                }
                break;
            case "left":
                {
                    ctX = x1 + calculateControlOffset(x2 - x1, c);
                    ctY = y1;
                }
                break;
        }
        return [ctX, ctY];
    }

    // returns string to pass into edge 'path' svg d attribute (where to be drawn)
    // referenced from ReactFlow.dev
    function getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition = "left",
        targetX,
        targetY,
        targetPosition = "right",
        curvature = 0.25,
    }) {
        const [sourceControlX, sourceControlY] = getControlWithCurvature({
            pos: sourcePosition,
            x1: sourceX,
            y1: sourceY,
            x2: targetX,
            y2: targetY,
            c: curvature,
        });
        const [targetControlX, targetControlY] = getControlWithCurvature({
            pos: targetPosition,
            x1: targetX,
            y1: targetY,
            x2: sourceX,
            y2: sourceY,
            c: curvature,
        });
        return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
    }

    // determining center of the bezier curve to know where to place the bezier edge text label
    function getSimpleBezierCenter({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature = 0.25,
    }) {
        const [sourceControlX, sourceControlY] = getControlWithCurvature({
            pos: sourcePosition,
            x1: sourceX,
            y1: sourceY,
            x2: targetX,
            y2: targetY,
            c: curvature,
        });
        const [targetControlX, targetControlY] = getControlWithCurvature({
            pos: targetPosition,
            x1: targetX,
            y1: targetY,
            x2: sourceX,
            y2: sourceY,
            c: curvature,
        });
        // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
        // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
        const centerX =
            sourceX * 0.125 +
            sourceControlX * 0.375 +
            targetControlX * 0.375 +
            targetX * 0.125;
        const centerY =
            sourceY * 0.125 +
            sourceControlY * 0.375 +
            targetControlY * 0.375 +
            targetY * 0.125;
        const xOffset = Math.abs(centerX - sourceX);
        const yOffset = Math.abs(centerY - sourceY);
        return [centerX, centerY, xOffset, yOffset];
    }

    /*------------------------------- Lifecycle ------------------------------*/

    // pass in params to function that returns a string value for SVG path d attribute (where to be drawn)
    $: path = getSimpleBezierPath(params);
    $: [centerX, centerY] = getSimpleBezierCenter(params);

    $: baseEdgeProps = {
        canvasId: canvasId,

        id: 0,
        source: 0,
        target: 0,

        animate: animate,

        edgeColor: "default",

        sourceX: source.x,
        sourceY: source.y,
        sourcePosition: "left",

        targetX: target.x,
        targetY: target.y,
        targetPosition: "right",

        path: path,
        centerX: centerX,
        centerY: centerY,
    };
</script>

<BaseEdge {baseEdgeProps} {canvasId} />
