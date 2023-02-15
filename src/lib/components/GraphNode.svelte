<!--
 * @file GraphNode.svelte
 * @author James Bennion-Pedley
 * @brief Node Style Override
 * @date 13/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang='ts'>
    /*-------------------------------- Imports -------------------------------*/

    import type { SvelteComponent } from "svelte";

    import { Settings } from "@svicons/ionicons-outline";

    /*--------------------------------- Props --------------------------------*/

    export let icon: SvelteComponent = Settings;

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<div class="node">
    <svelte:component this={icon} color="#c8ced0" height="52px"/>
</div>


<style>
    .node {
        width: 60px;
        height: 60px;

        background-color: #d8e0e2;
        border-radius: 10px;
        border: 3px solid black;

        display: grid;
        place-items: center;
    }
</style>
