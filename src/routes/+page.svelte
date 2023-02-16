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
    // TEMP
    import type { GraphTheme } from "$lib/middlewares/svelvet";
    /*-------------------------------- Imports -------------------------------*/

    import Noflo, { type NofloTheme } from "$lib/Noflo.svelte";
    import Library from "$lib/test/components";

    /*--------------------------------- Props --------------------------------*/

    let noflo: Noflo;

    let theme: GraphTheme = 'light';

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<div class="editor">
    <Noflo library={Library} bind:this={noflo} bind:theme/>
</div>

<div class=overlay>
    <button on:click={() => {
        theme = theme === 'light' ? 'dark' : 'light';
    }}>Toggle Theme</button>
</div>


<style>
    .editor {
        top: 5vh;
        left: 5vw;

        position: fixed;
        width: 90vw;
        height: 90vh;
        z-index: 0;

        border: 1px solid red;
    }

    .overlay {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        padding: 0.5rem;
    }

    .overlay button {
        font-size: 1.2rem;
    }
</style>

