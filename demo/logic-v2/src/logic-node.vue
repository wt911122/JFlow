<template>
    <j-logic-node-group  v-if="layoutNode.isDefault" :source="node">
    </j-logic-node-group >
    <j-logic-node-group 
        v-else
        :source="node" 
        :configs="configs"
        v-on="$listeners"
        @click="onClickWrapper"
        @contextclick="onContextClick"
        @instancemousemove="setPointerCursor"
        @dblclick="onDblclick"
        @afterResolveMovingTarget="onAfterResolveMovingTarget"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave">
        <j-group :configs="iconGroup">
            <j-icon :configs="imageConfig" />
        </j-group>

        <j-group :configs="textGroup">
            <j-text :configs="{
                fontSize: '12px',
                textColor: '#222',
                content: node.content,
                maxWidth: 159,
                ellipsis: true,
                textAlign: 'left'
            }">
            </j-text>
        </j-group>
    </j-logic-node-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import {
    ConceptColorMap,
    ConceptSubColorMap,
    ConceptIconMap,
} from './configs';

function translateToClientCoord(jflowInstance) {
    const p = [
        -jflowInstance.width/2,
        -jflowInstance.height/2,
    ];
    const gp = jflowInstance.calculateToRealWorld(p);
    // console.log(jflowInstance._jflow.DOMwrapper.getBoundingClientRect())
    const { x, y } = jflowInstance._jflow.DOMwrapper.getBoundingClientRect();
    return [gp[0] + x, gp[1] + y];
}
const rootLayout = new LinearLayout({
    direction: 'horizontal',
    gap: 10,
});
export default { 
    inject: ['renderJFlow', 'poppups', 'modal', 'closePopper', 'setFocus', 'isOnFocus'],
    props: {
        node: Object,
        layoutNode: Object,
    },
    data() {
        const node = this.node;
        
        const subcolor = ConceptSubColorMap[node.concept]
        const icon = ConceptIconMap[node.concept];
        return {
           
            iconGroup: {
                borderRadius: 4,
                padding: 4,
                backgroundColor: subcolor,
            },
            textGroup: {
                width: 159,
                paddingTop: 10,
                paddingBottom: 10,
            },
            imageConfig: {
                image: icon,
                width: 24,
                height: 24,
            }
        }
    },
    computed: {
        selectionMeta() {
            return this.poppups.selectionMeta;
        },
        selectionActive() {
            return this.selectionMeta.active && this.selectionMeta.target === this.node;
        },
        modalMeta() {
            return this.modal.modalMeta;
        },
        isFocused() {
            return this.isOnFocus(this.node);
        },
        configs() {
            const color = ConceptColorMap[this.node.concept];
            const focused = this.isFocused
            let shadow = {
                shadowColor: 'transparent',
            };
            if (focused) {
                shadow = {
                    shadowColor: 'rgba(81, 124, 255)',
                    shadowBlur: 15,
                };
            }
            console.log('opacity', this.layoutNode.rootLayoutNode ? 0.5 : 1)
            return {
                layout: rootLayout,
                borderWidth: 2,
                borderColor: focused ? '#517CFF': color,
                backgroundColor: '#fff',
                borderRadius: 4,
                height: 32,
                opacity: this.layoutNode.rootLayoutNode ? 0.5 : 1,
                ...shadow,
            }
        }
    },
    updated() {
        this.renderJFlow();
    },
    methods: {
        setPointerCursor($event) {
            $event.detail.jflow.canvas.style.cursor = 'pointer';
            $event.detail.bubbles = false;
        },
        onContextClick(event) {
            event.detail.bubbles = false;
            const { clientX, clientY } = event.detail.event;

            Object.assign(this.selectionMeta, {
                type: 'operate',
                clientX,
                clientY,
                active: true,
                target: this.layoutNode,
            });
        },
        onDblclick() {
            Object.assign(this.modalMeta, {
                active: true,
                target: this.node,
            });
        },
        onAfterResolveMovingTarget(event) {
            const jflow = event.detail.jflow;
            const renderNodes = this.layoutNode.getNodes(jflow);
            jflow.setMovingTargets(renderNodes);
        },
        onMouseEnter(event) {
            const { currentTarget } = event;
            console.log(event)
            const [x, y] = translateToClientCoord(currentTarget);
            Object.assign(this.selectionMeta, {
                type: 'hovercontent',
                clientX: x,
                clientY: y,
                active: true,
                target: this.node,
            });
        },
        onMouseLeave(event) {
            if(this.selectionActive) {
                this.closePopper()
            }
        },
        onClickWrapper(event){
            event.detail.bubbles = false;
            this.setFocus(this.node);
        }
    }
}
</script>

<style>

</style>