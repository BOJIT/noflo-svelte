    /* Automatically lay out graph */
    // function autolayoutGraph() {
    //     if(workerURL === "") {
    //         return;
    //     }
    //     let portInfo = app.refs.graph.getPortInfo();

    //     var options = {
    //         "intCoordinates": true,
    //         "algorithm": "de.cau.cs.kieler.klay.layered",
    //         "layoutHierarchy": true,
    //         "spacing": 20,
    //         "borderSpacing": 20,
    //         "edgeSpacingFactor": 0.2,
    //         "inLayerSpacingFactor": 2.0,
    //         "nodePlace": "BRANDES_KOEPF",
    //         "nodeLayering": "NETWORK_SIMPLEX",
    //         "edgeRouting": "POLYLINE",
    //         "crossMin": "LAYER_SWEEP",
    //         "direction": "RIGHT"
    //     };

    //     let kGraph = KlayNoflo.nofloToKieler(graph, portInfo, 'RIGHT');

    //     worker.postMessage({
    //         "graph": kGraph,
    //         "options": options
    //     });
    // }




    /* Auto Layout Engine */
    // import KlayNoflo from '$lib/workers/klay-noflo.js';

    /* Initialise worker if URL provided */
    // let worker = null;
    // function klayjsInit(url) {
    //     if((url !== "") && (worker === null)) {
    //         worker = new Worker(url);
    //         worker.addEventListener('message', function (e) {
    //             klayjsCallback(e.data);
    //         }, false);
    //     }
    // }

    // function klayjsCallback(kGraph) {
    //     // Back up old history
    //     let old_history = history.slice();

    //     const props = { snap: 10 };
    //     const children = kGraph.children.slice();

    //     let i;
    //     let len;
    //     for (i = 0, len = children.length; i < len; i++) {
    //         const klayNode = children[i];
    //         const fbpNode = graph.getNode(klayNode.id);

    //         // Encode nodes inside groups
    //         if (klayNode.children) {
    //             const klayChildren = klayNode.children;
    //             var idx;
    //             for (idx in klayChildren) {
    //             const klayChild = klayChildren[idx];
    //             if (klayChild.id) {
    //                 graph.setNodeMetadata(klayChild.id, {
    //                 x: Math.round((klayNode.x + klayChild.x) / props.snap) * props.snap,
    //                 y: Math.round((klayNode.y + klayChild.y) / props.snap) * props.snap,
    //                 });
    //             }
    //             }
    //         }

    //         // Encode nodes outside groups
    //         if (fbpNode) {
    //             graph.setNodeMetadata(klayNode.id, {
    //             x: Math.round(klayNode.x / props.snap) * props.snap,
    //             y: Math.round(klayNode.y / props.snap) * props.snap,
    //             });
    //         } else {
    //             // Find inport or outport
    //             const idSplit = klayNode.id.split(':::');
    //             const expDirection = idSplit[0];
    //             const expKey = idSplit[1];
    //             if (expDirection === 'inport' && graph.inports[expKey]) {
    //                 graph.setInportMetadata(expKey, {
    //                     x: Math.round(klayNode.x / props.snap) * props.snap,
    //                     y: Math.round(klayNode.y / props.snap) * props.snap,
    //                 });
    //             } else if (expDirection === 'outport' && graph.outports[expKey]) {
    //                 graph.setOutportMetadata(expKey, {
    //                     x: Math.round(klayNode.x / props.snap) * props.snap,
    //                     y: Math.round(klayNode.y / props.snap) * props.snap,
    //                 });
    //             }
    //         }
    //     }

    //     // Load single-change history tree
    //     let last_change = history.pop();
    //     history = old_history.slice();

    //     history.push(last_change);
    //     if(history.length > 10) {
    //         history.shift();
    //     }
    //     revision = history.length - 1;

    //     app.triggerFit();
    // }
