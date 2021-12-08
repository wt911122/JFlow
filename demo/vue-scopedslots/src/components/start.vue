<template>
    <j-group 
        :name="node.name" 
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave" 
        :configs="configs">
        <j-text ref="start" :configs="{
            font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
            textColor,
            content: '开始',
        }">
        </j-text>``
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
    mounted() {
        console.log(this)
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