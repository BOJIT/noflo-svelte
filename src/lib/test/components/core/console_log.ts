import type { ComponentFactory } from "$lib/types/ComponentTypes";

const componentFactory: ComponentFactory = {
    category: 'core',
    factory: (Component) => {
        /* Core component initialisation */
        const c = new Component({
            description: 'Logs packets to browser console',
            icon: 'info',
            inPorts: {
                in: {
                    datatype: 'object',
                    required: true,
                    // default: {} TODO modify noflo core
                }
            }
        });

        /* Component processing function */
        c.process((input, output) => {
            if (!input.hasData('in')) { return; }
            const msg = input.getData('in');
            console.log(msg);
            output.done();
        });

        return c;
    }
};

export default componentFactory;
