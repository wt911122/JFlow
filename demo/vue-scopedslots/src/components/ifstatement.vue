<template>
    <j-rhombus-group
        :source="node" 
        :configs="groupConfig"
        v-on="$listeners"
        @mouseenter="touch = true"
        @mouseleave="touch = false"
        @afterResolveMovingTarget="onAfterResolveMovingTarget">
        <j-point :configs="{
            backgroundColor: '#99DBC5',
            radius: 8,
            borderColor: '#33B88C',
            borderWidth: 2,
            absolutePosition: {
                top: 10,
                right: 10,
            }
        }" @click="shrink = !shrink"/>
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: '条件分支',
            lineHeight: 26,
            absolutePosition: {
                top: -13,
            }
        }"/>
        <j-group>
            <j-text v-if="shrink" :configs="{
                fontSize: '12px',
                textColor: '#585c63',
                content: 'ifstatement ' + node.id,
                lineHeight: 26,
                indent: 10,
            }"/>
            <j-rectangle v-else :configs="{
                    backgroundColor: '#FAAAAA',
                    width: 36,
                    height: 72,
                }">
            </j-rectangle>
        </j-group>
    </j-rhombus-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        node: Object,
        layoutNode: Object,
    },
    inject: ['renderJFlow'],
    data() {
        return {
            touch: false,
            shrinkButton: {
                backgroundColor: '#99DBC5',
                radius: 20,
                borderColor: '#33B88C',
            },
            shrink: false,
        }
    },
    computed: {
        groupConfig() {
            return  {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                borderColor: '#517cff',
                backgroundColor: this.touch ? 'red' : '#fff',
                shadowColor: '#517cff',
                shadowBlur: 15,
                borderWidth: 2,
                borderRadius: 5,
                padding: 30,
                marginTop: 30,
            }
        }
    },
    watch: {
        shrink(val){
            console.log(val)
        },
        touch(val) {
            console.log(val)
        },
    },
    updated() {
        this.renderJFlow();
    },
    methods: {
        onAfterResolveMovingTarget(event) {
            const jflow = event.detail.jflow;
            const layoutNode = jflow.getLayoutNodeBySource(this.node);
            const renderNodes = layoutNode.getNodes(jflow);
            jflow.setMovingTargets(renderNodes);
        }
    }
}
</script>

<style>

</style>