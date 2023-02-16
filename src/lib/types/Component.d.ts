/**
 * @file NofloTypes.d.ts
 * @author James Bennion-Pedley
 * @brief Custom types relating to the raw Component Library objects
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import type { SvelteComponent } from "svelte";

import { Component, ComponentOptions } from "noflo/lib/Component";

/*----------------------------------- Types ----------------------------------*/

type NofloComponentConstructor = new (o: ComponentOptions) => Component;

export type NofloComponentFactory = {
    // Metadata
    inPorts: string[]   // These should match the ports in your factory
    outPorts: string[]  // These are purely added so we don't need an instance to preview
    icon?: SvelteComponent
    category?: string,
    long_name?: string

    // Component Definition
    factory: (cc: NofloComponentConstructor) => Component;
}

export type NofloComponentLoader = (key: string) => NofloComponentFactory | undefined | null;
