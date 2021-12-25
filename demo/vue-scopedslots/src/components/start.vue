<template>
    <j-group 
        :name="node.name" 
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave" 
        :configs="configs">
        <j-text ref="start" :configs="{
            fontSize: '12px',
            textColor,
            content: '开始',
        }">
        </j-text>
        <j-point :configs="{
            color: '#99dbc5',
            radius: 11,
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
            textColor: '#585c63',
            configs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 0,
                }),
                borderColor: 'transparent',
                borderWidth: 0,
                hoverStyle: 'transparent',
                color: 'transparent',
                hasShrink: false,
                lock: true,
            }
        }
    },
    methods: {
        onMouseEnter(){
            this.textColor = 'red'
        },
        onMouseLeave() {
             this.textColor = '#585c63'
        }
    }
}
</script>

<style>

</style>