<template>
    <j-group 
        :jflowId="node.id"
        :configs="configs"
        @click="onClick">
        <j-group :configs="headerConfigs">
            <j-icon :configs="imageConfig" />
            <j-text :configs="{
                fontSize: '16px',
                textColor: '#585c63',
                content: 'JS 代码块',
            }" />
        </j-group>
        <j-shadow-dom :configs="editorRect"></j-shadow-dom>
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
            },
            headerConfigs: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0
                }),
                borderRadius: 10,
                borderColor: '#ccc',
                borderWidth: 0,
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
            },
            editorRect: {
                width: 568,
                height: 321,
                createDocument: (container) => {
                    const div = document.createElement('div');
                    div.style.height = '100%';
                    div.style.background = '#0d1117';
                    div.style.color = "#c9d1d9"
                    div.innerText = this.node.content;
                    div.setAttribute('contenteditable', true)
                    container.appendChild(div)
                }
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
            console.log(event);
            this.$emit('demojsblock')
        }
    }
}
</script>

<style>

</style>