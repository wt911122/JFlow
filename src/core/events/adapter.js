/**
 * 事件处理函数
 * @name EventAdapter~Handler
 * @function
 * @param {Event} event - 原生事件
 * @param {JFlow} jflow - 当前jflow 对象
 */

/**
 * EventAdapter 对象 plugin 配置
 * @typedef {Object} EventAdapter~pluginDef
 * @property {Object} canvas - canvas 相关的事件
 * @property {EventAdapter~Handler} canvas.eventName - 注册 canvas 上的事件处理
 * @property {Object} document - document 相关的事件
 * @property {EventAdapter~Handler} document.eventName - 注册 document 上的事件处理
 */

function getDefaultPlugin() {
    let _mouseStatus = {
        x: undefined,
        y: undefined,
        enableClick: false,
    }
    return {
        canvas: {
            wheel: function (event, jflow) {
                event.preventDefault();
                let { offsetX, offsetY, deltaX, deltaY } = event
                if(event.ctrlKey) { 
                    deltaY = -deltaY;
                    jflow.zoomHandler(offsetX, offsetY, deltaX, deltaY, event);
                } else {
                    jflow.panHandler(-deltaX, -deltaY, event);
                }
            },
            pointerdown: function (event, jflow) {
                const { offsetX, offsetY, deltaY, button } = event
                if(button !== 0) return;
                _mouseStatus.x = offsetX;
                _mouseStatus.y = offsetY;
                jflow.pressStartHandler(offsetX, offsetY, event);
            },
            pointermove: function (event, jflow) {
                const { offsetX, offsetY } = event
                jflow.pressMoveHandler(offsetX, offsetY, event);
            },
            pointerup: function (event, jflow) {
                event.preventDefault();
                // event.stopPropagation();
                const { offsetX, offsetY, button } = event
                if(button !== 0) return;
                if(_mouseStatus.x === offsetX && _mouseStatus.y === offsetY) {
                    _mouseStatus.x = undefined;
                    _mouseStatus.y = undefined;
                    _mouseStatus.enableClick = true;
                }
                jflow.pressUpHanlder(false, event)
            },
            contextmenu: function (event, jflow) {
                event.preventDefault();
                event.stopPropagation();
                const { offsetX, offsetY } = event;
                jflow.contextMenuHanlder(offsetX, offsetY, event);
            },
            dblclick: function (event, jflow) {
                event.preventDefault();
                event.stopPropagation();
                const { offsetX, offsetY } = event;
                jflow.dblclickHandler(offsetX, offsetY, event);
            },
            click: function(event, jflow) {
                event.preventDefault();
                event.stopPropagation();
                const { offsetX, offsetY } = event;
                if(_mouseStatus.enableClick) {
                    _mouseStatus.enableClick = false;
                    jflow.clickHanlder(offsetX, offsetY, event);
                }
                
            }
        },
        document: {
            pointerup: function(event, jflow) {
                jflow.pressUpHanlder(true, event);
            }
        }
    }
}

/** 
 * EventAdapter 对象
 * EventAdapter 通过 plugin 的形式实现多种交互方式的映射
 * @constructor EventAdapter
 */
class EventAdapter {
    constructor(plugin = {}) {
        this.plugin = getDefaultPlugin();
        this.use(plugin);
        this.canvasHandlers = [];
        this.documentHandlers = [];
    }
    use(plugin = {}) {
        const { canvas: ca, document: docObj } = plugin;
        if(ca) {
            for(let eventName in ca){
                if (ca.hasOwnProperty(eventName)) {
                    this.plugin.canvas[eventName] = ca[eventName];
                }
            }
        }
        if(docObj) {
            for(let eventName in docObj){
                if (docObj.hasOwnProperty(eventName)) {
                    this.plugin.document[eventName] = docObj[eventName];
                }
            }
        }
    }

    apply(jflow) {
        const { canvas: ca, document: docObj } = this.plugin;
        const canvas = jflow.canvas;
        for(let eventName in ca){
            const handler = ca[eventName];
            function handlerWrapperd (e) {
                handler(e, jflow);
            }
            canvas.addEventListener(eventName, handlerWrapperd)
            this.canvasHandlers.push({
                eventName,
                handlerWrapperd
            });
        }
        for(let eventName in docObj){
            const handler = docObj[eventName];
            function handlerWrapperd (e) {
                handler(e, jflow);
            }
            document.addEventListener(eventName, handlerWrapperd)
            this.documentHandlers.push({
                eventName,
                handlerWrapperd
            });
        }
    }

    unload(jflow) {
        const canvas = jflow.canvas;
        this.canvasHandlers.forEach(({ eventName, handlerWrapperd }) => {
            canvas.removeEventListener(eventName, handlerWrapperd);
        });
        this.documentHandlers.forEach(({ eventName, handlerWrapperd }) => {
            document.removeEventListener(eventName, handlerWrapperd);
        })
    }
}

export default EventAdapter;
