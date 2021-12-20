<template>
    <j-group v-on="$listeners" :name="node.name" :configs="configs">
        <j-group :configs="headerConfigs">
            <j-icon :configs="imageConfig" />
            <j-text :configs="{
                font: '16px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                textColor: '#585c63',
                content: '调用逻辑',
            }" />
        </j-group>
        <j-group @click="onClick" :configs="contentConfigs">
            <j-text :configs="{
                font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                textColor: '#585c63',
                content: node.content || '请选择接口' ,
                lineHeight: 26,
                indent: 10,
            }" />
        </j-group>
        <template v-if="node.params && node.params.length">
            <j-text :configs="{
                font: '16px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                textColor: '#585c63',
                content: '参数',
            }" />
            <j-group ref="paramGroup" :configs="paramsConfigs">
                <j-text v-for="param in node.params" 
                    :key="param.content"
                    :configs="{
                    font: '16px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                    textColor: '#585c63',
                    content: param.content,
                }" />
            </j-group>
        </template>
    </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import logicIcon from '../assets/logic.svg';
const p = new Image();
p.src = logicIcon;
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
                    alignment: 'start'
                }),
                padding: 10,
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 12,
                width: 220,
                hoverStyle: 'transparent',
                hasShrink: false,
                lock: true,
            },
            headerConfigs: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0
                }),
                borderRadius: 10,
                borderColor: '#ccc',
                hoverStyle: '#517cff',
                borderWidth: 0,
                lock: true,
            },
            contentConfigs: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 5,
                width: 200,
                hoverStyle: 'transparent',
                hasShrink: false,
                lock: true,
            },
            paramsConfigs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 0,
                    alignment: 'start'
                }),
                borderColor: 'transparent',
                hoverStyle: 'transparent',
                hasShrink: false,
                lock: true,
            },
            imageConfig: {
                image: p,
                width: 30,
                height: 30,
            }
        }
    },
    watch: {
        'node.params'() {
            this.$nextTick(() => {
                const instance = this.$refs.paramGroup._jflowInstance;
                instance.recalculateUp();
                instance._jflow._render();  
            })
        }
    },
    methods: {
        onClick(event) {
            console.log(event)
            event.detail.bubbles = false; 
            const { currentTarget } = event;
            const p = [ 0, currentTarget.height/2 ];
            const gp = currentTarget.calculateToRealWorld(p)
            // const [ offsetX, offsetY ] = gp;
            this.$emit('toggle-select', gp);
        }
    }
}
</script>

<style>

</style>