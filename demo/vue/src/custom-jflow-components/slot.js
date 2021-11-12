import { Rectangle, Group, JFlowEvent } from '@joskii/jflow';

class Slot extends Group{
    constructor(configs) {
        const rectangle = new Rectangle({
            padding: 8,
            width: 64,
            height: 36,
            borderRadius: 18,
            borderColor: 'rgb(0, 85, 204)',
            color: '#c2dbff',
        })
        super({
            ...configs,
            lock: true,
            hasShrink: false,
            borderColor: 'transparent',
            data: {
                instances: [
                    rectangle,
                ],
                links: [],
            }
        });
        const dropHandler = (event) => {
            const instance = event.detail.instance;
            if(instance._belongs) {
                instance._belongs.removeFromStack(instance);
            }
            this.addToStack(instance);
            rectangle.visible = false;
            this.recalculate();
            this.bubbleEvent(new JFlowEvent('droped'), {
                instance,
                bubbles: true,
            })
        };
        rectangle.addEventListener('drop', dropHandler);
        rectangle.addEventListener('mouseup', dropHandler);
    }


}

export default Slot;