<template>
    <j-group :name="name" :configs="configs">
        <slot name="header"></slot>
        <j-text :configs="{
            font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
            textColor: '#585c63',
            content: this.subTitle,
        }" />
        <slot name="content"></slot>
    </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        name: String,
        subTitle: String,
    },
    data() {
        return {
            configs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 0,
                    alignment: 'start'
                }),
                padding: 10,
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 12,
                width: 300,
                hoverStyle: 'transparent',
                hasShrink: false,
                lock: true,
            }
        }
    }
}
</script>

<style>

</style>