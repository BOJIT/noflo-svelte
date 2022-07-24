<!--
 * @file index.svelte
 * @author James Bennion-Pedley
 * @brief Brief summary here
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
-->


<script lang='ts'>
    import Noflo from "$lib/Noflo.svelte";
    import Library from "$lib/test/components";

    let API: any;
    let state: any;
</script>


<div class="editor">
    <Noflo library={Library} bind:API bind:state/>
</div>

<div class=overlay>
    <button on:click={() => {
        API.addNode('filter');
    }}>Add Filter</button>
    <button on:click={() => {
        API.addNode('console log');
    }}>Add Log</button>
    <button on:click={() => {
        if(state.selection.type === 'node') {
            API.removeNode(state.selection.target);
        } else if(state.selection.type === 'edge') {
            API.removeEdge(state.selection.target);
        }
    }}>Remove Selected</button>
    <button on:click={() => {
        API.recentreGraph();
    }}>Recentre</button>
    <button on:click={() => {
        API.clearGraph();
    }}>Clear</button>
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
