<template>
    <div>
        <div>
            <button draggable="true" style="border: 1px solid red" @dragstart="onDragSimpleNode">simplenode</button>
        </div>
        <j-jflow
            ref="jflow"
            style="width: 800px; height: 600px; border: 1px solid #000"
            :genVueComponentKey="genVueComponentKey"
            :configs="configs">
            <template #SimpleNode="{ source }">
                <text-group-node 
                    :node="source">
                </text-group-node>
            </template>
        </j-jflow>
    </div>
</template>
<script>
import DemoLayout from './layout';
// import VirtualNode from './virtual-node.vue';
import textGroupNode from './text-group-node.vue';
import { commonEventAdapter } from '../../../src/index';

let uniqueId = 10;
const layout = new DemoLayout({
    nodes: [
        {
            elements: [
                'xxxx', 
                {
                    type: 'SimpleNode',
                    name: 'simpleNode3',
                },
                {
                    type: 'SimpleNode',
                    name: 'simpleNode2',
                },
                'asdfs\nfadsf',
                {
                    type: 'SimpleNode',
                    name: 'simpleNode1',
                },
                '\ndafsdf\ndfasdf',
                {
                    type: 'SimpleNode',
                    name: 'simpleNode4',
                },
                'asdfas\ndfggf\nddd'
            ]
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
        textGroupNode,
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