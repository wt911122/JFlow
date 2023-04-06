<template>
    <div>
        <j-jflow
            ref="jflow"
            style="width: 800px; height: 600px; border: 1px solid #000"
            :genVueComponentKey="genVueComponentKey"
            :configs="configs">
            <template #SimpleNode="{ source }">
                <scroll-node
                    :node="source">
                </scroll-node>
            </template>
        </j-jflow>
    </div>
</template>
<script>
import DemoLayout from './layout';
// import VirtualNode from './virtual-node.vue';
import scrollNode from './scroll-node.vue';
import { commonEventAdapter } from '../../../src/index';

let uniqueId = 10;
const layout = new DemoLayout({
    nodes: [
        {
            content: 'asffgaasffgaasffgaasffgaasffgaasffgaasffgaasffgaasffgaasffgaasffga',
        }
    ]
});
export default {
    provide(){
        return {
            renderJFlow: this.renderJFlow
        }  
    },
    components: {
        scrollNode,
    },
    data() {
        return {
            configs: {
                allowDrop: true,
                layout,
                eventAdapter: commonEventAdapter
            }
        }
    },
    methods: {
        genVueComponentKey(source){
            return source.name;
        },
        onDragSimpleNode() {
            console.log('dragstart')
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: {
                    type: 'SimpleNode',
                    name: `SimpleNode-${uniqueId ++}`,
                },
            })
        },
        renderJFlow() {
            this.$refs.jflow.renderJFlow();
        },
    }
};
</script>