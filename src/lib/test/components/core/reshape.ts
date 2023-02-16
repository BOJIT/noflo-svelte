import type { NofloComponentFactory } from "$lib/types/Component";
import { ExtensionPuzzle } from "@svicons/ionicons-outline";

const componentFactory: NofloComponentFactory = {
    inPorts: ['augend', 'addend', 'anotherInput', 'otherTest', 'HEY'],
    outPorts: ['sum', 'notify'],
    category: 'core',
    icon: ExtensionPuzzle,

    factory: (Component) => {
        /* Core component initialisation */
        const c = new Component({
            description: 'reshapes a data packet',
            inPorts: {
                augend: {
                    datatype: 'number',
                    required: true,
                },
                addend: {
                    datatype: 'number',
                    required: true,
                },
            },
            outPorts: {
                sum: {
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
