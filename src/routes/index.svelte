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
</script>

<div class="editor">
    <Noflo library={Library} bind:API/>
</div>

<div class=overlay>
    <button on:click={() => {
        API.addComponent('filter');
    }}>ADD</button>
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
