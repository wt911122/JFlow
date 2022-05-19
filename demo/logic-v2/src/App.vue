<template>
<div style="position: relative;">
    <j-jflow ref="jflow" 
        :class="$style.wrapper" 
        :configs="configs"
        :loading.sync="jflowloading"
        :genVueComponentKey="genVueComponentKey"
        @click="closePopper">
            <template #LogicBasic="{ source, layoutNode }">
                <logic-Node 
                    :node="source" 
                    :layoutNode="layoutNode">
                </logic-Node>
            </template>
            <template #Start="{ source }">
                <start-Node :node="source"></start-Node>
            </template>
            <template #endpoint="{ source }">
                <end-point-node :node="source"></end-point-node>
            </template>
            <template #End="{ source }">
                <end-Node :node="source"></end-Node>
            </template>
            <template #switchcaselink="{configs}" >
                <switch-link :linkConfigs="configs">
                </switch-link>
            </template>
            <template #plainlink="{ configs }">
                <logic-link :linkConfigs="configs">
                </logic-link>
            </template>
    </j-jflow>
    
    <poppup-comp
            :meta="poppups.selectionMeta">
        </poppup-comp>
        <modal-comp 
            :meta="modal.modalMeta">
        </modal-comp>
</div>
</template>

<script>
import sourceData from '../data/data.json';
import logicLayout from '../layout/logic-layout';
import logicNode from './logic-node.vue';
import startNode from './start-node.vue';
import EndPointNode from './endpoint-node.vue';
import endNode from './end-node.vue';
import LogicLink from './link-component/logic-link.vue';
import SwitchLink from './link-component/switch-link.vue';
import poppupComp from './poppups/poppup';
import modalComp from './model/modal.vue';

let uuid = 0;
export default {    
    components: {
        startNode,
        endNode,
        logicNode,
        EndPointNode,
        LogicLink,
        SwitchLink,
        poppupComp,
        modalComp
    },
    provide() {
        return {
            renderJFlow: this.renderJFlow,
            reOrderAndReflow: this.reOrderAndReflow,
            closePopper: this.closePopper,
            poppups: this.poppups,
            modal: this.modal,
        }
    },
    data() {
        const layout = new logicLayout(sourceData);
        const configs = Object.freeze({
            allowDrop: true,
            layout,
            initialZoom: 1,
            minZoom: .2,
            NodeRenderTop: true,
            setInitialPosition(realboxX, realboxY, realboxW, realboxH, cx, cy, cwidth, cheight) {
                return {
                    x: realboxX + cwidth / 2,
                    y: cy,
                };
            },
        })
        return {
            configs,
            sourceData,
            jflowloading: false,

            poppups: {
                selectionMeta: {
                    type: undefined,
                    active: false,
                    clientX: 0,
                    clientY: 0,
                    target: null,
                    payload: null,
                },
            },
            modal: {
                modalMeta: {
                    active: false,
                    target: null,
                },
            }
        }
    },
    methods: {
        renderJFlow() {
            console.log('renderJFlow')
            this.$refs.jflow.renderJFlow();
        },
        reOrderAndReflow() {
            // logger('reOrderAndReflow');
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow();
        },
        // onLink(event) {
        //     const jflowInstance = this.$refs.jflow.getInstance()
        //     const source = event.detail.payload.instance;
        //     console.log(source)
        //     const anchor = event.detail.anchor;
        //     const newNode = { id: `auto-${uuid++}`};
        //     this.sourceData.push(newNode);
        //     if(!source.next) {
        //         source.next = [];
        //     }
        //     source.next.push(newNode.id);
        //     this.configs.layout.reOrder(this.sourceData);
        //     this.$refs.jflow.reflow(() => {
        //         const renderNode = jflowInstance.getRenderNodeBySource(newNode) 
        //         renderNode.anchor = anchor;
        //     });
        // },
        // onLinking(meta) {
        //     const { source, target } = meta;
        //     if(!source.next) {
        //         source.next = [];
        //     }
        //     const exist = source.next.find(t => t === target.id);
        //     if(!exist) {
        //         source.next.push(target.id);
        //         this.configs.layout.reOrder(this.sourceData);
        //         this.$refs.jflow.reflow();
        //     }
        // },
        genVueComponentKey(source){
            return source.id;
        },
        // removelink(linkConfigs) {
        //     const sourceNext = linkConfigs.from.source.next;
        //     const toId = linkConfigs.to.source.id;

        //     const idx = sourceNext.indexOf(toId);
        //     sourceNext.splice(idx, 1);

        //     this.configs.layout.reOrder(this.sourceData);
        //     this.$refs.jflow.reflow();
        // }


        closePopper() {
            Object.assign(this.poppups.selectionMeta, {
                type: undefined,
                active: false,
                clientX: 0,
                clientY: 0,
                target: null,
                payload: null,
            });
        },
    }
}
</script>

<style module>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.wrapper{
    width: 1200px;
    height: 600px;
    border: 1px solid #ccc;
}
</style>
