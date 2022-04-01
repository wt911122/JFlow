<template>
<div style="position: relative;">
    <j-jflow ref="jflow" 
        :class="$style.wrapper" 
        :configs="configs"
        :loading.sync="jflowloading"
        :genVueComponentKey="genVueComponentKey"
        @link="onLink">
            <template #FreeNode="{ source }">
                <orange-Node :node="source" @toLink="onLinking"></orange-Node>
            </template>
            <template #plainlink="{ configs }">
                <jBezierLink
                    :configs="{
                        ...configs,
                        backgroundColor: '#EB6864',
                    }"
                    :from="configs.from.source"
                    :to="configs.to.source">
                </jBezierLink>
            </template>
    </j-jflow>
</div>
</template>

<script>
import FreeLayout from './freeLayout';
import OrangeNode from './orangeNode.vue';
let uuid = 0;
export default {    
    components: {
        OrangeNode
    },
    provide() {
        return {
            renderJFlow: this.renderJFlow,
        }
    },
    data() {
        const sourceData = [
            { id: 'a', next: ['b'] },
            { id: 'b' },
            { id: 'c' }
        ]
        const layout = new FreeLayout(sourceData);
        const configs = Object.freeze({
            allowDrop: true,
            layout,
            initialZoom: 1,
            minZoom: .2,
        })
        return {
            configs,
            sourceData,
            jflowloading: false,
        }
    },
    methods: {
        renderJFlow() {
            this.$refs.jflow.renderJFlow();
        },
        onLink(event) {
            const jflowInstance = this.$refs.jflow.getInstance()
            const source = event.detail.payload.instance;
            console.log(source)
            const anchor = event.detail.anchor;
            const newNode = { id: `auto-${uuid++}`};
            this.sourceData.push(newNode);
            if(!source.next) {
                source.next = [];
            }
            source.next.push(newNode.id);
            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow(() => {
                const renderNode = jflowInstance.getRenderNodeBySource(newNode) 
                debugger
                renderNode.anchor = anchor;
            });
        },
        onLinking(meta) {
            const { source, target } = meta;
            if(!source.next) {
                source.next = [];
            }
            const exist = source.next.find(t => t === target.id);
            if(!exist) {
                source.next.push(target.id);
                this.configs.layout.reOrder(this.sourceData);
                this.$refs.jflow.reflow();
            }
        },
        genVueComponentKey(source){
            return source.id;
        }
    }
}
</script>

<style module>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.wrapper{
    width: 800px;
    height: 600px;
    border: 1px solid #ccc;
}
</style>
