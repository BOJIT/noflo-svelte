
import type { SvelteComponent } from 'svelte';
/** this is where we create our node store */
import type { FbpNodeType } from '$lib/types/FbpGraph';
import { stores } from '$lib/state/store';
import { getAnchors, getEdgeById } from '../../edges/controllers/util';


export class Node implements FbpNodeType {
    constructor(
        public id: string,
        public icon: SvelteComponent,
        public component: string,
        public label: string,
        public bgColor: string,
        public inPorts: string[],
        public outPorts: string[],

        public positionX: number,
        public positionY: number,
        public height: number,
        public width: number,
        public canvasId: string,
        public clickCallback: Function
    ) { }

    /**
     * setPositionFromMovement will update the positionX and positionY of the Node when user drags a Node around on the canvas, reflect the changes in real time in the nodesStore, and also cascade the changes to all relative elements like Anchors and Edges.
     * @param {number} movementX The mouse movement value on the X-axis
     * @param {number} movementY The mouse movement value on the Y-axis
     */
    setPositionFromMovement(movementX: number, movementY: number) {
        const {
            nodesStore,
            // anchorsStore,
        } = stores[this.canvasId];

        //update all necessary data
        this.positionX += movementX;
        this.positionY += movementY;

        //update all the anchors on the node in the anchorsStore
        // anchorsStore.update((anchors) => {
        //     for (const anchorId in anchors) {
        //         if (anchors[anchorId].nodeId === this.id) {
        //             anchors[anchorId].setPositionFromNode();
        //         }
        //     }
        //     return { ...anchors };
        // });
    }

    /**
     * delete will handle the deletion of a Node (also waterfall down to delete anchors and edges)
     */
    delete() {
        const store = stores[this.canvasId];
        const { nodesStore, anchorsStore, edgesStore } = stores[this.canvasId];

        nodesStore.update((nodes) => {
            for (const nodeId in nodes) {
                if (nodes[nodeId].id === this.id) {
                    delete nodes[nodeId];
                }
            }
            return { ...nodes };
        });

        // variable `anchors` is an array of Anchor objects on the node
        const anchors = getAnchors(store, { nodeId: this.id });
        for (let anchorSelf of anchors) {
            const edgeId = anchorSelf.edgeId;
            const edge = getEdgeById(store, edgeId);
            edge.delete(); // this also deletes anchors. TODO: maybe this should be renamed to explicitly say
        }
    }
}
