import type { NofloComponentFactory } from "$lib/types/Component";
import { Receipt } from "@svicons/ionicons-outline";

const componentFactory: NofloComponentFactory = {
    inPorts: ['in'],
    outPorts: [],
    category: 'core',
    icon: Receipt,

    factory: (Component) => {
        /* Core component initialisation */
        const c = new Component({
            description: 'Logs packets to browser console',
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
