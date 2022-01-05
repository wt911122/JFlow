<template>
    <j-group :name="node.name" :configs="configs">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#000',
            content: 'End',
        }">
        </j-text>
        <j-rectangle :configs="{
            color: '#FAAAAA',
            width: 36,
            height: 36,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#F55656',
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffsetY: 2,
            shadowOffsetX: 0,
        }"></j-rectangle>
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
                    gap: 0,
                }),
                borderColor: 'transparent',
                borderWidth: 0,
                hoverStyle: 'translate',
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