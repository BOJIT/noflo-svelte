import { Component, ComponentOptions } from "noflo/lib/Component";

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
