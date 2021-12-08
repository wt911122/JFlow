<template>
    <j-group :name="node.name" :configs="configs">
        <j-text :configs="{
            font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
            textColor: '#585c63',
            content: '结束',
        }">
        </j-text>
        <j-rectangle :configs="{
            color: '#faaaaa',
            width: 20,
            height: 20,
            borderRadius: 2,
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