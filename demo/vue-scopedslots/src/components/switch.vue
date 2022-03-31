<template>
    <j-capsule-vertical-group 
        :source="node" 
        :configs="configs"
        v-on="$listeners"
        @afterResolveMovingTarget="onAfterResolveMovingTarget">
        <j-text :configs="{
            fontSize: '12px',
            textColor,
            content: node.id,
        }">
        </j-text>
        <template v-for="switchcase in node.cases">
            <j-switchcase :node="switchcase" :key="switchcase.id" />
        </template>
    </j-capsule-vertical-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import switchCase from './switchcase.vue';
export default {
    components: {
        // 'j-variable': variable,
        'j-switchcase': switchCase,
    },
    props: {
        node: Object,
    },
    data() {
        return {
            textColor: '#585c63',
            configs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 10,
                }),
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 5,
                paddingTop: 20,
                paddingBottom: 20
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