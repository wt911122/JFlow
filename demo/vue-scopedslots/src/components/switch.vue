<template>
    <j-group 
        :name="node.name" 
        :configs="configs"
        v-on="$listeners">
        <j-text :configs="{
            fontSize: '12px',
            textColor,
            content: node.content,
        }">
        </j-text>
        <template v-for="switchcase in node.cases">
            <j-switchcase :node="{ content: switchcase.id, name: switchcase.id }" :key="switchcase.id" />
        </template>
    </j-group>
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
                    gap: 0,
                }),
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 5,
                hoverStyle: 'transparent',
                color: 'transparent',
                hasShrink: false,
                lock: true,
            }
        }
    }
}
</script>

<style>

</style>