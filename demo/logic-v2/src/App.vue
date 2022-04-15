<template>
<div style="position: relative;">
    <j-jflow ref="jflow" 
        :class="$style.wrapper" 
        :configs="configs"
        :loading.sync="jflowloading"
        :genVueComponentKey="genVueComponentKey">
            <template #LogicBasic="{ source }">
                <logic-Node :node="source"></logic-Node>
            </template>
            <template #Start="{ source }">
                <start-Node :node="source"></start-Node>
            </template>
            <template #endpoint="{ source }">
                <end-point-node :node="source"></end-point-node>
            </template>
            <template #End="{ source }">
                <end-Node :node="source"></end-Node>
            </template>
            <template #plainlink="{ configs }">
                <jLink
                    :configs="{
                        ...configs,
                        backgroundColor: '#919499',
                    }"
                    :from="configs.from.source"
                    :to="configs.to.source"
                    @contextclick="removelink(configs)">
                </jLink>
            </template>
    </j-jflow>
</div>
</template>

<script>
import sourceData from '../data/data.json';
import logicLayout from '../layout/logic-layout';
import logicNode from './logic-node.vue';
import startNode from './start-node.vue';
import EndPointNode from './endpoint-node.vue';
import endNode from './end-node.vue';
let uuid = 0;
export default {    
    components: {
        startNode,
        endNode,
        logicNode,
        EndPointNode
    },
    provide() {
        return {
            renderJFlow: this.renderJFlow,
        }
    },
    data() {
        const layout = new logicLayout(sourceData);
        const configs = Object.freeze({
            allowDrop: true,
            layout,
            initialZoom: 1,
            minZoom: .2,
            NodeRenderTop: true,
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
        },
        removelink(linkConfigs) {
            const sourceNext = linkConfigs.from.source.next;
            const toId = linkConfigs.to.source.id;

            const idx = sourceNext.indexOf(toId);
            sourceNext.splice(idx, 1);

            this.configs.layout.reOrder(this.sourceData);
            this.$refs.jflow.reflow();
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
    width: 1200px;
    height: 600px;
    border: 1px solid #ccc;
}
</style>
