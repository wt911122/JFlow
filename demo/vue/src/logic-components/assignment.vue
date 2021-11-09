<template>
    <j-group :name="this.name" :configs="configs">
        <j-text :configs="{
            font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
            textColor: '#585c63',
            content: '赋值',
        }" />
        <j-group :configs="assignmentGroup" >
            <j-variable :configs="{content: 'variable'}">
            </j-variable>
            <j-text :configs="{
                font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                textColor: '#585c63',
                content: '=',
            }" />
            <j-slot @droped="onDrop"></j-slot>
        </j-group>
    </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        name: String,
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
                hoverStyle: 'transparent',
                color: 'transparent',
                hasShrink: false,
                lock: true,
            },
            assignmentGroup: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0
                }),
                borderRadius: 10,
                padding: 10,
                borderColor: '#ccc',
                hoverStyle: '#517cff',
                borderWidth: 2,
                lock: true,
                hasShrink: true,
            }
        }
    },
    methods: {
        onDrop($event) {
            console.log($event)
        },
        onHover() {
            // this.
        }
    }
}
</script>

<style>

</style>