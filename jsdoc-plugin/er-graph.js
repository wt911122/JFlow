import erLayout from './erlayout';
import JFlow, { Group, Text, BezierLink, LinearLayout, commonEventAdapter } from '../src/core/flow';
function renderNode(erNode) {
    const className = new Text({
        content: erNode.id,
        textColor: '#2780E3'
    });
    const wrapper = new Group({
        layout: new LinearLayout({
            direction: 'vertical',
            gap: 0,
        }),
        borderRadius: 8,
        borderColor: '#2780E3',
        borderWidth: 2,
    });
    if(erNode.source.module) {
        const moduleName = new Text({
            content: erNode.source.module.name,
            textColor: '#2780E3'
        });
        const td1 = new Group({
            padding: 15,
            border: {
                right: {
                    borderWidth: 2,
                    borderColor: '#2780E3',
                }
            }
        });
        const td2 = new Group({
            padding: 15,
        });
        td1.addToStack(className);
        td1.recalculate();
        console.log(td1.height);
        td2.addToStack(moduleName);
        td2.recalculate();
        console.log(td2.height)

        const w2 = new Group({
            layout: new LinearLayout({
                direction: 'horizontal',
                gap: 0,
            }),
        });
        w2.addToStack(td1);
        w2.addToStack(td2);
        w2.recalculate();
        console.log(w2.height)
        
        wrapper.addToStack(w2);
        const w3 = new Group({
            padding: 15
        })
        const configName = new Text({
            content: erNode.source.configName,
            textColor: '#2780E3'
        });
        w3.addToStack(configName);
        w3.recalculate();
        if(w2.width > w3.width) {
            w2.setConfig({
                border: {
                    bottom: {
                        borderWidth: 2,
                        borderColor: '#2780E3',
                    }
                }
            })
        } else {
            w3.setConfig({
                border: {
                    top: {
                        borderWidth: 2,
                        borderColor: '#2780E3',
                    }
                }
            })
        }
        wrapper.addToStack(w3)
        wrapper.recalculate();
        console.log(erNode.id, wrapper.height)
    } else {
        wrapper.addToStack(className);
        wrapper.setConfig({
            padding: 15,
            borderRadius: 8,
            borderColor: '#2780E3',
            borderWidth: 2,
        })
        wrapper.recalculate();
        console.log(erNode.id, wrapper.height)
    }
    wrapper._ERnode = erNode;
    erNode.getJflowInstance = () => wrapper;
    // wrapper.addEventListener('click', () => {

    // })
    return wrapper;
}

function renderLink(linkmeta) {
    const meta = linkmeta.meta;
    const link = new BezierLink({
        ...linkmeta,
        content: linkmeta.part,
        to: meta.from.getJflowInstance(),
        from: meta.to.getJflowInstance(),
        backgroundColor: '#2780E3',
        fontSize: '16px'
    });
    return link;
}

function render (data, elemId) {
    const layout = new erLayout(data);
    const jflowStage = new JFlow({
        allowDrop: false,
        layout,
        eventAdapter: commonEventAdapter
    });

    layout.flowStack.forEach(erNode => {
        const Node = renderNode(erNode);
        jflowStage.addToStack(Node);
    });

    layout.flowLinkStack.forEach(linkMeta => {
        const link = renderLink(linkMeta);
        jflowStage.addToLinkStack(link);
    });

    const div = document.getElementById(elemId);
    div.style.width = '100%';
    jflowStage.$mount(div);
}

window.renderErGraph = render;
export default render;