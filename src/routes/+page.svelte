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

    import Noflo, { type NofloTheme } from "$lib";
    import Library from "$lib/test/components";

    /*--------------------------------- Props --------------------------------*/

    let noflo: Noflo;
    let theme: NofloTheme = 'light';
    let graph = {
        "caseSensitive": false,
        "properties": {
        "name": ""
        },
        "inports": {},
        "outports": {},
        "groups": [],
        "processes": {
        "q7": {
            "component": "serial in",
            "metadata": {
                "label": "serial in",
                "x": 100,
                "y": 50,
            }
        },
        "23wa": {
            "component": "reshape",
            "metadata": {
                "label": "reshape",
                "x": 100,
                "y": 200,
                "portSettings": [
                    {
                        "name": "augend",
                        "mode": "constant",
                        "constant": "{}"
                    },
                    {
                        "name": "addend",
                        "mode": "constant",
                        "constant": "ts\n\t\t{et\"}\n\t"
                    }
                ]
            }
        }
        },
        "connections": [
        {
            "src": {
            "process": "q7",
            "port": "out"
            },
            "tgt": {
            "process": "q7",
            "port": "port"
            },
            "metadata": {}
        },
        {
            "src": {
            "process": "q7",
            "port": "out"
            },
            "tgt": {
            "process": "23wa",
            "port": "augend"
            },
            "metadata": {
            "route": 0
            }
        },
        {
            "data": {},
            "tgt": {
            "process": "23wa",
            "port": "augend"
            }
        },
        {
            "data": {},
            "tgt": {
            "process": "23wa",
            "port": "addend"
            }
        }
        ]
    };

    /*-------------------------------- Methods -------------------------------*/

    /*------------------------------- Lifecycle ------------------------------*/

</script>


<div class="editor">
    <Noflo bind:this={noflo} bind:graph={graph} bind:theme minimap='top-right'/>
</div>

<div class=overlay>
    <button on:click={() => {
        theme = theme === 'light' ? 'dark' : 'light';
    }}>Toggle Theme</button>
    <button on:click={() => {
        console.log(graph);
    }}>Log Graph</button>
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

