<template>
<div>
<div :class="$style.body">
    <div :class="$style.sidebar">
        <div v-for="p in conceptList" :key="p.concept">
            <div draggable="true" 
                :class="$style.part" 
                type="IfStatement"
                @dragstart="onDragStart(p.concept)">
                {{p.concept}}
            </div>
        </div>
      </div>
      <div style="position: relative;">
    <j-jflow ref="jflow" 
        :class="$style.wrapper" 
        :configs="configs"
        :loading.sync="jflowloading"
        :genVueComponentKey="genVueComponentKey"
        @click="closePopper"
        @drop="onDrop"
        @pressEnd="onPressEnd">
            <template #LogicBasic="{ source, layoutNode }">
                <logic-Node 
                    :node="source" 
                    :layoutNode="layoutNode"
                    @pressStart="onPressStart(source)">
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
                <logic-link :linkConfigs="configs"
                    @drop="onDropToLink($event, configs)">
                </logic-link>
            </template>
    </j-jflow>
      </div>
    
    <poppup-comp
            :meta="poppups.selectionMeta">
        </poppup-comp>
        <modal-comp 
            :meta="modal.modalMeta">
        </modal-comp>

        
</div>
<div>
            <div>参数设置</div>
            <div>
                <ul>
                    <li>
                        行间距: <input type="number" :value="layoutConstance.rowGap" @change="onChange($event, 'rowGap')"></input>
                    </li>
                    <li>
                        列间距: <input type="number" :value="layoutConstance.columnGap" @change="onChange($event, 'columnGap')"></input>
                    </li>
                    <li>
                        逻辑块高度: <input type="number" :value="layoutConstance.rowHeight" @change="onChange($event, 'rowHeight')"></input>
                    </li>
                    <li>
                        逻辑块宽度: <input type="number" :value="layoutConstance.columnWidth" @change="onChange($event, 'columnWidth')"></input>
                    </li>
                    <li>
                        折线最小延伸距离X: <input type="number" :value="layoutConstance.minSpanX" @change="onChange($event, 'minSpanX')"></input>
                    </li>
                    <li>
                        折线最小延伸距离Y: <input type="number" :value="layoutConstance.minSpanY" @change="onChange($event, 'minSpanY')"></input>
                    </li>
                    <li>
                        循环回来的线最小延伸距离Y: <input type="number" :value="layoutConstance.minGapY" @change="onChange($event, 'minGapY')"></input>
                    </li>
                </ul>
            </div>
        </div>
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
import { initLayoutConstance, setLayoutConstance, layoutConstance } from '../layout/utils';

import {
    ConceptColorMap,
    ConceptSubColorMap,
    ConceptIconURLMap,
} from './configs';
import { genNode } from "./data/data";
function getList() {
    return [
        "Assignment",
        "ForEach",
        "Switch",
        "While",
        "If"
    ].map(c => ({
        concept: c,
        color: ConceptColorMap[c],
        subcolor: ConceptSubColorMap[c],
        icon: ConceptIconURLMap[c],
    }))
}

let uuid = 0;
initLayoutConstance();
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
            focusOn: this.focusOn,
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
            currentTarget: null,
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
            },

            conceptList: getList(),

            layoutConstance
        }
    },
    methods: {
        renderJFlow() {
            console.log('renderJFlow')
            this.$refs.jflow.renderJFlow();
        },
        reOrderAndReflow(node) {
            // logger('reOrderAndReflow');
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow();
            if(node) {
                this.$nextTick(() => {
                    if(node.concept === 'Switch') {
                        this.focusOn(node.cases[0]);
                    } else {
                        this.focusOn(node);
                    }
                })
            }
        },

        onPressStart(source) {
            this.currentTarget = source;
        },
        onPressEnd() {
            this.currentTarget = null;
        },
        onDropToLink(e, linkConfigs) {
            const jflowInstance = this.$refs.jflow.getInstance();
            let node = e.detail.instance;
            if(this.currentTarget) {
                node = this.currentTarget;
                const layoutNode = jflowInstance.getLayoutNodeBySource(node);
                layoutNode.remove();
            }
            linkConfigs.from.linkSource(node, linkConfigs);
            this.reOrderAndReflow(node);
           
        },
        focusOn(source) {
            const jflowInstance = this.$refs.jflow.getInstance();
            const i = jflowInstance.getRenderNodeBySource(source);
             console.log(i.isInViewBox)
            if (i && !i.isInViewBox) {
                jflowInstance.focusOn(i);
            }
        },
        onDrop(e) {
            const jflowInstance = this.$refs.jflow.getInstance();
            const astblock = e.detail.instance;
            this.sourceData.playground.push(astblock);
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow(() => {
                jflowInstance.getRenderNodeBySource(astblock).anchor = e.detail.point;
            });
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
        onDragStart(concept) {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: genNode(concept),
            })
        },

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

        onChange(e, key){
            const value = +e.target.value;
            setLayoutConstance(key, value);
            this.reOrderAndReflow();
        }
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
.body{
    display: flex;
    flex-direction: horizontal;
}
.sidebar{
    width: 180px;
    border: 2px solid gold;
}
.sidebar > div {
    padding: 16px;
    display: flex;
    justify-content: center;
}
.sidebar > div > .part {
    width: 80px;
    height: 50px;
    background-color: gold;
    text-align: center;
    line-height: 50px;
}
</style>
