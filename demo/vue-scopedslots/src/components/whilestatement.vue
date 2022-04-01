<template>
    <j-rhombus-group
        :source="node" 
        :configs="groupConfig"
        v-on="$listeners"
        @afterResolveMovingTarget="onAfterResolveMovingTarget">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: node.content,
            lineHeight: 26,
            indent: 10,
        }"/>
    </j-rhombus-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        node: Object,
    },
    computed: {
        groupConfig() {
            return  {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 5,
                padding: 30,
            }
        }
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