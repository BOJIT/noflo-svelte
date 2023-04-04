
// import type {
//     EdgeType,
//     StoreType,
//     UserEdgeType,
// } from '$lib/types/FbpGraph';
import { Edge } from '../../edges/models/Edge';
import { getAnchors } from '../../edges/controllers/util';

/**
 * Populates edgesStore of Edges. This function does not return the edgesStore. Instead it sets the nodesStore of Svelvet store.
 * @param store An object containing the state of the Svelvet component. You can access the following through `store`: nodesStore, edgesStore, anchorsStore, etc.
 * @param edges An edge that the user specifies. This is NOT the same as a Edge object.
 * @param canvasId The canvasId of the Svelvet component that holds the Edges
 */
export function populateEdgesStore(
    store: StoreType,
    edges: UserEdgeType[],
    canvasId: string
) {
    const edgesStore: { [key: string]: EdgeType } = {};
    for (let i = 0; i < edges.length; i++) {
        const userEdge = edges[i];
        //  { id: 'e1-2', source: 1, type: 'straight', target: 2, label: 'e1-2' },
        // source is node.id for the source node
        // target is node.id for the target node
        // We need to get the anchors
        const {
            source: sourceNodeId,
            target: targetNodeId,
            id: edgeId,
            type,
            label,
            labelBgColor,
            labelTextColor,
            edgeColor,
            animate,
            noHandle,
            arrow,
            clickCallback,
            className,
        } = userEdge;

        const anchors = getAnchors(store, { edgeId: edgeId });
        // check that we have two anchors for every edge
        if (anchors.length !== 2) throw 'We should have two anchors for every node';
        // check that we have 1 source anchor and 1 target anchor. Since sourceOrTarget is typed to be either 'source'
        //   or 'target', it suffices to check whether there are two unique elements
        if (new Set(anchors.map((e) => e.sourceOrTarget)).size !== 2)
            throw 'we should have one source and one target anchor';
        // get source and target anchor
        let sourceAnchor, targetAnchor;
        if (anchors[0].sourceOrTarget === 'source') {
            sourceAnchor = anchors[0];
            targetAnchor = anchors[1];
        } else {
            sourceAnchor = anchors[1];
            targetAnchor = anchors[0];
        }

        edgesStore[edgeId] = new Edge(
            edgeId,
            sourceAnchor.positionX,
            sourceAnchor.positionY,
            targetAnchor.positionX,
            targetAnchor.positionY,
            canvasId,
            userEdge.label === undefined ? '' : userEdge.label,
            userEdge.type === undefined ? 'bezier' : userEdge.type,
            userEdge.labelBgColor === undefined ? 'white' : userEdge.labelBgColor,
            userEdge.labelTextColor === undefined ? 'black' : userEdge.labelTextColor,
            userEdge.edgeColor === undefined ? 'default' : userEdge.edgeColor,
            userEdge.animate === undefined ? false : userEdge.animate,
            userEdge.noHandle === undefined ? false : userEdge.noHandle,
            userEdge.arrow === undefined ? false : userEdge.arrow,
            userEdge.clickCallback === undefined ? () => { } : userEdge.clickCallback,
            userEdge.className === undefined ? '' : userEdge.className
        );
    }
    store.edgesStore.set(edgesStore);
}
