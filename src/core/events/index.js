class JFlowEvent extends CustomEvent{
    constructor(event, configs = {}) {
        const detail = {
            ...configs,
            originEvent: configs.event,
            target: configs.target,
            jflow: configs.jflow,
            bubbles: configs.bubbles || false,    
        }
        super(event, {
            detail
        });
    }
}

export default JFlowEvent;