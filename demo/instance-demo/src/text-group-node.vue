<template>
    <j-text-group
        ref="textgroup"
        :source="node"
        :genVueComponentKey="genVueComponentKey"
        :configs="configs"
        @change="onChange"
        @insert="onInsert">
        <template #SimpleNode="{ source }">
            <simple-node :node="source" ></simple-node>
        </template>
    </j-text-group>
</template>
<script>
import { TextElement } from '../../../src/index';
import simpleNode from './simple-node.vue';
export default {
    components: {
        simpleNode,
    },
    props: {
        node: Object,
    },
    data() {
        return {
            configs: {
                borderWidth: 1,
                borderColor: '#ddd',
                textColor: '#000',
                lineHeight: 22,
                fontSize: '18px',
                resolver: this.resolver.bind(this),
            }
        }
    },
    methods: {
        resolver() {
            const elements = [];
            this.node.elements.map(s => {
                if(typeof s === 'string') {
                    const rows = s.split(/\r?\n/);
                    rows.forEach((l, idx) => {
                        let element = new TextElement('text', l);
                        if(rows[idx+1] !== undefined) {
                            element.needWrap = true;
                        }
                        elements.push(element);
                    });
                } else {
                    elements.push(new TextElement(s.type, s));
                }
            });
            return elements
        },
        genVueComponentKey(source){
            return source.name;
        },
        onChange(event) {
            const textElements = event.detail.textElements;
            console.log(textElements);
            const str = this.node.elements.filter(s => typeof s === 'string').join('');
            const strnew = textElements.filter(el => el.type ==='text').map(el => `${el.source}${el.needWrap ? '\n' : ''}`).join('');
            if(strnew !== str) {
                this.refresh(textElements);
            }
        },
        refresh(textElements){
            const elements = [];
            let str = '';
            textElements.forEach(el => {
                if(el.type === 'text') {
                    str += el.source;
                    if(el.needWrap) {
                        str += '\n';
                    }
                } else {
                    if(str) {
                        elements.push(str);
                        str = '';
                    }
                    elements.push(el.source);
                }
            });
            if(str) {
                elements.push(str);
            }
            console.log(elements)
            this.node.elements = elements;
            this.$refs.textgroup.reflow();
        },
        onInsert(event) {
            // const instance = event.detail.target;
            const {
                idx, offset, textElements, instance
            } = event.detail;
            if(offset > 0) {
                const currElement = textElements[idx];
                const content = currElement.source;
                const beforeContent = content.substring(0, offset);
                const afterContent = content.substring(offset);
                const t = new TextElement('text', afterContent);
                t.needWrap = currElement.needWrap
                textElements.splice(idx, 1, 
                    new TextElement('text', beforeContent),
                    new TextElement(instance.type, instance),
                    t);
            } else {
                textElements.splice(idx, 0, new TextElement(instance.type, instance));  
            }
            this.refresh(textElements);
            
        }
    }
}
</script>