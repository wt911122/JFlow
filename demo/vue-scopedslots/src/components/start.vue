<template>
    <j-group 
        :jflowId="node.id" 
        :configs="configs">
        <j-text ref="start" :configs="{
            fontSize: '12px',
            textColor: '#000',
            content: 'Start',
        }">
        </j-text>
        <j-point :configs="{
            backgroundColor: '#99DBC5',
            radius: 20,
            borderColor: '#33B88C',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffsetY: 2,
            shadowOffsetX: 0,
        }"></j-point>
    </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        node: Object,
    },
    data() {
        return {
            configs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 10,
                }),
                borderColor: 'transparent',
                borderWidth: 0,
            },
        }
    },
}
</script>

<style>

</style>