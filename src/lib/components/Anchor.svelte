<!--
 * @file Anchor.svelte
 * @author James Bennion-Pedley
 * @brief Node connection anchors (the dots on each node)
 * @date 27/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    import type { FbpPositionType } from "$lib/types/FbpGraph";
    /*-------------------------------- Imports -------------------------------*/

    import type { NofloStore } from "$lib/types/Noflo";

    import { clickOutside } from "$lib/utils/clickoutside";

    /*--------------------------------- Props --------------------------------*/

    export let store: NofloStore;
    export let pos: FbpPositionType;
    export let parentPos: FbpPositionType;

    let active: boolean = false;
    const { edgeCandidateStore } = store;

    const radius = 3;

    /*-------------------------------- Methods -------------------------------*/

    function mousemove(e: MouseEvent | TouchEvent) {
        if (!active) return;

        // TODO get relative space coordinates

        edgeCandidateStore.update((c) => {
            c.target = { x: e.screenX, y: e.screenY };
            return c;
        });
    }

    /*------------------------------- Lifecycle ------------------------------*/

    // If another candiate becomes inactive override latest click
    edgeCandidateStore.subscribe((c) => {
        if (c.active == false) active = false;
    });

    function clickoutside(e: MouseEvent | TouchEvent) {
        if (!active) return;
        if (e.target == undefined) return;

        active = false;
        edgeCandidateStore.update((c) => {
            c.active = false;
            return c;
        });

        if (e.target.classList.contains("anchor")) {
            // Create new edge
            console.log("NEW EDGE");
            setTimeout(() => {
                edgeCandidateStore.update((c) => {
                    c.active = false;
                    return c;
                });
            }, 1);
        }
    }

    function click(e: MouseEvent | TouchEvent) {
        if (active) {
            active = false;
            edgeCandidateStore.update((c) => {
                c.active = false;
                return c;
            });
        } else {
            active = true;
            edgeCandidateStore.update((c) => {
                c.source = {
                    x: parentPos.x + pos.x - 10 - radius,
                    y: parentPos.y + pos.y + radius,
                };
                c.active = true;
                return c;
            });
        }
    }
</script>

<svelte:window on:mousemove={mousemove} on:touchmove={mousemove} />

<circle
    on:mousemove={mousemove}
    on:touchmove={mousemove}
    on:click={click}
    use:clickOutside
    on:click_outside={clickoutside}
    on:keypress
    class="anchor"
    class:active
    class:potential={$edgeCandidateStore.active}
    cx={pos.x}
    cy={pos.y}
    r={radius}
    stroke="#444444"
/>

<style>
    .anchor {
        pointer-events: auto;
        fill: white;
    }

    .anchor.potential {
        fill: green;
    }

    .anchor.active {
        fill: red !important;
    }

    .anchor:hover {
        fill: #8da7a1;
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.7));
    }

    :global(.svelvet-dark) .anchor:hover {
        filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.7));
    }
</style>
