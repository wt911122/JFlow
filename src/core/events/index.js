/**
 * JFlow 抛出事件
 * @extends CustomEvent
 * @property {Event}  originEvent      - 原始事件
 * @property {Instance} target         - 事件触发对象
 * @property {JFlow} jflow             - JFlow 对象
 * @property {boolean} bubbles         - 冒泡标识
 */
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