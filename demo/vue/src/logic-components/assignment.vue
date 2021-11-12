<template>
    <j-group 
        v-on="$listeners" 
        :name="node.name" 
        :configs="configs">
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
            <logic-node v-if="dropInstance" v-bind="dropInstance"></logic-node>
            <j-slot v-else @drop="onDrop" @pressEnd="onDrop"></j-slot>
        </j-group>
    </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import logicNode from './logic-node';
export default {
    components: {
        'logic-node': logicNode,
    },
    props: {
        node: Object,
        initialAnchor: Array,
    },
    data() {
        return {
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
            },

            dropInstance: null,
        }
    },
    computed: {
        configs() {
            return  {
               layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 0,
                }),
                borderColor: 'transparent',
                borderWidth: 0,
                hoverStyle: 'transparent',
                color: 'transparent',
                hasShrink: false,
                anchor: this.initialAnchor,
                lock: true,
            }
        }
    },
    methods: {
        onDrop($event) {
            console.log($event)
            const instance = 
            $event.detail.bubbles = false;
            this.dropInstance = {
                anchor: $eve
            }
        },
        onHover() {
            // this.
        },
    }
}
</script>

<style>

</style>