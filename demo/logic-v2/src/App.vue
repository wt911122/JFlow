<template>
<div>
<div :class="$style.body">
    <div :class="$style.sidebar">
        <div v-for="p in conceptList" :key="p.concept">
            <div draggable="true" 
                :class="$style.part" 
                type="IfStatement"
                @dragstart="onDragStart($event, p.concept)"
                @dragend="onDragEnd">
                {{p.concept}}
            </div>
            <div :ref="`templete-${p.concept}`" :class="[$style.literalRef]">
                <div :class="$style.part" >
                    {{ p.concept }}
                </div>
                <!-- <div :class="$style.literal" :style="sizeStyle" :name="node.icon"></div> -->
            </div>
        </div>
      </div>
      <div style="position: relative;">
    <j-jflow ref="jflow" 
        :class="$style.wrapper" 
        :configs="configs"
        :loading.sync="jflowloading"
        :genVueComponentKey="genVueComponentKey"
        @click="onClickCanvas"
        @drop="onDrop"
        @pressEnd="onPressEnd">
            <template #LogicBasic="{ source, layoutNode }">
                <logic-Node 
                    :node="source" 
                    :layoutNode="layoutNode"
                    @pressStart="onPressStart(source)"
                    @outOfFlow="onOutOfFlow($event, source)">
                </logic-Node>
            </template>
            <template #Start="{ source }">
                <start-Node :node="source" @click="startAllAnimate"></start-Node>
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
    <div :class="$style.minimap">
            <div :class="$style.content" ref="minimap" >
            </div>
        </div>
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
import { initLayoutConstance, setLayoutConstance, layoutConstance, setSourceInitialAnchor } from '../layout/utils';

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
            animate: this.animate,
            status: this.status,

            setFocus: this.setFocus,
            isOnFocus: this.isOnFocus,
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
            // worldMargin: 400,
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

            layoutConstance,

            focus: null,
            animate: {
                link: false,
            },
            status: {
                dragging: {
                    active: false,
                }
            }
        }
    },
    watch: {
        jflowloading(val) {
            if(!val) {
                this.captureMap();
            }
        },
        'status.dragging.active'(val) {
            console.log('NodeDragging', val)
        }
    },
    methods: {
        captureMap() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.captureMap(this.$refs.minimap, {
                padding: 10,
                placement: 'center'
            });
        },
        startAllAnimate(e) {
            console.log('startAllAnimate')
            e.detail.bubbles = false;
            this.animate.link = true;
        },
        onClickCanvas() {
            this.closePopper();
            this.setFocus(null);
            this.animate.link = false;
        },
        renderJFlow() {
            console.log('renderJFlow')
            this.$refs.jflow.renderJFlow();
        },
        reOrderAndReflow(node) {
            // logger('reOrderAndReflow');
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow(undefined, () => {
                this.captureMap();
                if(node) {
                    if(node.concept === 'Switch') {
                        this.focusOn(node.cases[0]);
                    } else {
                        this.focusOn(node);
                    }
                }
            });
        },

        onPressStart(source) {
            this.currentTarget = source;
            const jflowInstance = this.$refs.jflow.getInstance();
            const layoutNode = jflowInstance.getLayoutNodeBySource(source);
            if(layoutNode.rootLayoutNode) {
                this.status.dragging.active = true;
            }
        },
        onPressEnd() {
            const jflowInstance = this.$refs.jflow.getInstance();
            const i = jflowInstance.getRenderNodeBySource(this.currentTarget);
            jflowInstance.setNodeToTopLayer(i);
            this.currentTarget = null;
            this.status.dragging.active = false;
        },
        onDragEnd() {
            this.status.dragging.active = false;
        },
        onDropToLink(e, linkConfigs) {
            const jflowInstance = this.$refs.jflow.getInstance();
            let node = e.detail.instance;
            if(this.currentTarget) {
                node = this.currentTarget;
                const layoutNode = jflowInstance.getLayoutNodeBySource(node);
                if(layoutNode.source.concept === 'SwitchCase') {
                    node = layoutNode.parent.source;
                    layoutNode.parent.delete();
                } else {
                    layoutNode.delete();
                }
            }
            linkConfigs.from.linkSource(node, linkConfigs);
            this.reOrderAndReflow(node);
            this.status.dragging.active = false;
           
        },
        setFocus(node) {
            this.focus = node;
            this.animate.link = false;
        },
        isOnFocus(target) {
            return this.focus === target;
        },
        focusOn(source) {
            const jflowInstance = this.$refs.jflow.getInstance();
            const i = jflowInstance.getRenderNodeBySource(source);
             console.log('isInViewBox', i.isInViewBox)
            if (i && !i.isInViewBox) {
                jflowInstance.focusOn(i);
                this.captureMap();
            }
        },
        onDrop(e) {
            const jflowInstance = this.$refs.jflow.getInstance();
            const astblock = e.detail.instance;
            const point = e.detail.point;
            this.sourceData.playground.push(astblock);
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow(() => {
                setSourceInitialAnchor(jflowInstance, astblock, point)
            }, this.captureMap);    
            this.status.dragging.active = false;        
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
        onDragStart(e, concept) {
            const { dataTransfer } = e;
            const node = this.$refs[`templete-${concept}`][0];
            
            const { width, height } = node.getBoundingClientRect();
            console.log(width, height)
            
            dataTransfer.setDragImage(node, -width - 10, -height - 10);
            this.dragging = true;
            e.dataTransfer.effectAllowed = 'copyMove';
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: genNode(concept),
            });
            this.status.dragging.active = true;
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
        },

        onOutOfFlow(e, source) {
            const point = e.detail.point;
            const jflowInstance = this.$refs.jflow.getInstance();
            const layoutNode = jflowInstance.getLayoutNodeBySource(source);
            let node = source;
            if(layoutNode.source.concept === 'SwitchCase') {
                node = layoutNode.parent.source;
                layoutNode.parent.delete();
            } else {
                layoutNode.delete();
            }
            this.sourceData.playground.push(node);
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow(() => {
                setSourceInitialAnchor(jflowInstance, node, point)
            }, this.captureMap);  
        }
    }
}
</script>

<style module>
#app {
  font-family: PingFang SC, Avenir, Helvetica, Arial, sans-serif;
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
.part {
    width: 80px;
    height: 50px;
    background-color: gold;
    text-align: center;
    line-height: 50px;
}
.literalRef {
    position: absolute;
    z-index: -999;
    top: -999px;
    left: -999px;
}

.minimap{
    position: absolute;
    top: 20px;
    right: 20px;
    background: #ccc;
    opacity: 0.5;
}
.minimap > .content {

    width: 260px;
    height: 180px;
}

</style>
