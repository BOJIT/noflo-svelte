/**
 * @file history.ts
 * @author James Bennion-Pedley
 * @brief History module for enabling simple undo/redo of graphs
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*--------------------------------- Imports ----------------------------------*/

import FbpGraph from '$lib/fbp-graph';

import type { Graph } from '$lib/fbp-graph/Graph';
import type { GraphJson } from 'fbp-graph/lib/Types';

/*------------------------------ Primary Class -------------------------------*/

class History {
    Length: number = 0;
    MaxLength: number = 10;    // Default number of history records to keep
    Buffer: GraphJson[] = [];
    Revision: number = 0;

    constructor(initial_state: Graph, max_length?: number) {
        this.Buffer.push(initial_state.toJSON());

        if(max_length) { this.MaxLength = max_length; }
    }

    save(graph: Graph) {
        this.Buffer.length = this.Revision + 1;     // Truncate any redo history

        // Increment history buffer and set revision pointer
        this.Buffer.push(graph.toJSON());
        if(this.Buffer.length > this.MaxLength) { this.Buffer.shift(); }
        this.Revision = this.Buffer.length - 1;
    }

    async undo() {
        if(this.canUndo) {
            this.Revision -= 1;
            return await FbpGraph.loadJSON(this.Buffer[this.Revision]);
        }
    }

    async redo() {
        if(this.canRedo) {
            this.Revision += 1;
            return await FbpGraph.loadJSON(this.Buffer[this.Revision]);
        }
    }

    get canUndo() {
        return this.Revision !== 0;
    }

    get canRedo() {
        return this.Revision !== this.Buffer.length - 1;
    }
}

/*----------------------------------------------------------------------------*/

export default History;
