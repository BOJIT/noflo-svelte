/**
 * @file ComponentTypes.d.ts
 * @author James Bennion-Pedley
 * @brief Custom types relating to the raw Component Library objects
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import { Component, ComponentOptions } from "noflo/lib/Component";

/*----------------------------------- Types ----------------------------------*/

type ComponentConstructor = new (o: ComponentOptions) => Component;

export type ComponentFactory = {
    // Metadata
    category?: string,
    long_name?: string

    // Component Definition
    factory: (cc: ComponentConstructor) => Component;
}

export type ComponentLibrary = {
    [key: string]: ComponentFactory
}
