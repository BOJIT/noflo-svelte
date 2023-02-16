import type { ComponentFactory } from "$lib/types/Component";

const componentFactory: ComponentFactory = {
    category: 'core',
    factory: (Component) => {
        /* Core component initialisation */
        const c = new Component({
            description: 'filters based on an input string',
            icon: 'filter',
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
