import type { NofloComponentFactory } from "$lib/types/Component";
import { Filter } from "@svicons/ionicons-outline";

const componentFactory: NofloComponentFactory = {
    inPorts: ['input'],
    outPorts: ['output'],
    category: 'core',
    icon: Filter,

    factory: (Component) => {
        /* Core component initialisation */
        const c = new Component({
            description: 'filters based on an input string',
            inPorts: {
                input: {
                    datatype: 'number',
                    required: true,
                }
            },
            outPorts: {
                output: {
                    datatype: 'number',
                },
            },
        });

        /* Component processing function */
        c.process((input, output) => {
            if (!input.hasData('augend', 'addend')) { return; }
                const [augend, addend] = input.getData('augend', 'addend');
                output.sendDone({
                sum: Number(augend) + Number(addend),
            });
        });

        return c;
    }
}

export default componentFactory;
