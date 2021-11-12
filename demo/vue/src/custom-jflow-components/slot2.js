import { Rectangle, Group, JFlowEvent } from '@joskii/jflow';

class Slot extends Rectangle{
    constructor(configs) {
        super({
            padding: 8,
            width: 64,
            height: 36,
            borderRadius: 18,
            borderColor: 'rgb(0, 85, 204)',
            color: '#c2dbff',
        });
    }


}

export default Slot;