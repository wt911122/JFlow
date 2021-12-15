<template>
    <j-group
        :name="node.name" 
        :configs="groupConfig"
        v-on="$listeners">
        <j-text :configs="{
            font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
            textColor: '#585c63',
            content: 'ifstatement' + node.name,
            lineHeight: 26,
            indent: 10,
        }"/>
    </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        node: Object,
        initialAnchor: Array,
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
                hasShrink: false,
                lock: true,
                anchor: this.initialAnchor, 
            }
        }
    },
}
</script>

<style>

</style>