<!--
 * @file +page.svelte
 * @author James Bennion-Pedley
 * @brief Demo page
 * @date 12/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import Noflo, { type NofloState } from "$lib/Noflo.svelte";
    import Library from "$lib/test/components";

    /*--------------------------------- Props --------------------------------*/

    let noflo: Noflo;
    let state: NofloState;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<div class="editor">
    <Noflo library={Library} bind:this={noflo} bind:state/>
</div>

<div class=overlay>
    <button on:click={() => {
        noflo.addNode('filter');
    }}>Add Filter</button>
    <button on:click={() => {
        noflo.addNode('console log');
    }}>Add Log</button>
    <button on:click={() => {
        if(state.selection.type === 'node') {
            noflo.removeNode(state.selection.target);
        } else if(state.selection.type === 'edge') {
            noflo.removeEdge(state.selection.target);
        }
    }}>Remove Selected</button>
    <button on:click={() => {
        noflo.recentreGraph();
    }}>Recentre</button>
    <button on:click={() => {
        noflo.clearGraph();
    }}>Clear</button>
    <button on:click={() => {
        noflo.undo();
    }}>Undo</button>
    <button on:click={() => {
        noflo.redo();
    }}>Redo</button>
</div>


<style>
    :global(body) {
        margin: 0px;
        background-color: black;
    }

    .editor {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .overlay {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        padding: 1rem;
    }

    .overlay button {
        font-size: 1.5rem;
    }
</style>

