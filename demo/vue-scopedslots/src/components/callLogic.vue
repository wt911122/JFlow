<template>
    <j-group v-on="$listeners" :name="node.name" :configs="configs">
        <j-group :configs="headerConfigs">
            <j-icon :configs="imageConfig" />
            <j-text :configs="{
                fontSize: '16px',
                textColor: '#585c63',
                content: '调用逻辑',
            }" />
        </j-group>
        <j-group @click="onClick" :configs="contentConfigs">
            <j-text :configs="{
                fontSize: '12px',
                textColor: '#585c63',
                content: node.content || '请选择接口' ,
            }" />
            <j-text :configs="{
                fontSize: '12px',
                textColor: '#585c63',
                content: node.content || 'sss接口' ,
            }" />
            <j-text :configs="{
                fontSize: '12px',
                textColor: '#585c63',
                content: node.content || '接口' ,
            }" />
        </j-group>
        <template v-if="node.params && node.params.length">
            <j-group ref="paramGroup" :configs="paramsConfigs">
                <j-text :configs="{
                    fontSize: '16px',
                    textColor: '#585c63',
                    content: '参数',
                }" />
                <j-text v-for="param in node.params" 
                    :key="param.content"
                    :configs="{
                    fontSize: '16px',
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
                    justify: 'start',
                }),
                borderColor: '#517cff',
                borderWidth: 2,
                borderRadius: 5,
                width: 200,
                height: 36,
                lock: true,
            },
            paramsConfigs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 0,
                    alignment: 'end'
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
        'node.params'(val) {
            this.$nextTick(() => {
                if(this.$refs.paramGroup) {
                    const instance = this.$refs.paramGroup._jflowInstance;
                    instance.recalculateUp();
                    instance._jflow._render();  
                }  
            })
        }
    },
    methods: {
        onClick(event) {
            console.log(event)
            event.detail.bubbles = false; 
            const { currentTarget } = event;
            const p = [ -currentTarget.width/2, currentTarget.height/2 ];
            console.log(p)
            const gp = currentTarget.calculateToRealWorld(p)
            // const [ offsetX, offsetY ] = gp;
            this.$emit('toggle-select', gp);
        }
    }
}
</script>

<style>

</style>