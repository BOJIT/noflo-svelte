import { Component } from "noflo/lib/Component";

import type { ComponentLibrary } from "$lib/types/ComponentTypes";
import type { Icon, IconLibrary } from "$lib/types/IconTypes";

/*----------------------------------------------------------------------------*/

function generateIconLibrary(library: ComponentLibrary) {
    let icon_lib: IconLibrary = {};

    for (const [name, component] of Object.entries(library)) {
        const instance = component.factory(Component);

        const entry: Icon = {
            name: name,
            icon: instance.icon,
            description: instance.description,
            inports: [],
            outports: [],
        };

        for (const [key] of Object.entries(instance.inPorts.ports)) {
            entry.inports.push({
                name: key,
                type: 'all'
            });
        }

        for (const [key] of Object.entries(instance.outPorts.ports)) {
            entry.outports.push({
                name: key,
                type: 'all'
            });
        }

        icon_lib[name] = entry;
    }

    return icon_lib;
}

/*----------------------------------------------------------------------------*/

export default generateIconLibrary;
