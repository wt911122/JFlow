<template>
    <j-group v-on="$listeners" :name="name" :configs="groupConfig">
        <j-group v-on="$listeners" :configs="inputGroupConfig">
            <j-text :configs="{
                font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                textColor: '#000',
                content,
                lineHeight: 26,
                indent: 10,
            }"/>
        </j-group>
    </j-group>
</template>

<script>
import { Group, Point, Text, Icon, LinearLayout } from '@joskii/jflow';
export default {
    props: {
        width: {
            type: Number,
            default: 112,
        },
        content: String,
        name: String,
        outflow: Boolean,
    },
    data() {
        console.log(this.width)
        return {
            groupConfig: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                padding: 7,
                borderColor: '#05c',
                color: '#c2dbff',
                borderWidth: 2,
                borderRadius: 5,
                hoverStyle: 'transparent',
                hasShrink: false,
                lock: true,
            },
            inputGroupConfig: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                borderColor: '#337eff',
                color: '#fff',
                borderWidth: 2,
                borderRadius: 5,
                width: this.width,
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