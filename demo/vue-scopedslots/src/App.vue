<template>
  <div id="app" :class="$style.body">
      <div :class="$style.sidebar">
        <div>
            <div draggable="true" :class="$style.rect" type="Rectangle" @dragstart="onDragStartRectangle">Rectangle</div>
        </div>
        <div>
            <div draggable="true" :class="$style.circle" type="Point" @dragstart="onDragStartPoint">Circle</div>
        </div>
      </div>
      <div style="position: relative;">
        <j-jflow ref="jflow" 
            :class="$style.wrapper" 
            :configs="configs"
            @drop="onDrop"
            @pressEnd="onPressEnd">
                <template #start="{ configs }">
                    <j-start :node="{ name: configs.id }"></j-start>
                </template>
                <template #end="{ configs }">
                    <j-end :node="{ name: configs.id }"></j-end>
                </template>
                <template #variable="{ configs, meta }">
                    <j-variable :node="{ name: configs.id, content: configs.content }" 
                    @pressStart="onPressStart(configs)" 
                    @outOfFlow="onOutOfFlow($event, meta)"></j-variable>
                </template>
                <template #endpoint="{ configs }">
                    <j-endpoint :node="{ name: configs.id }"></j-endpoint>
                </template>
                <template #plainlink="{ configs }">
                    <jBezierLink
                        :from="configs.from"
                        :to="configs.to"
                        @drop="onDropToLink($event, configs)">
                    </jBezierLink>
                </template>
        </j-jflow>
        <div ref="hoverblock" :style="`transform: translate(${offsetX}px, ${offsetY}px)`" :class="$style.hoverblock" v-if="isHover">
            HOVER!!!
        </div>
      </div>
  </div>
</template>

<script>
import { LinearLayout, Lowcodelayout, Rectangle, Point } from '@joskii/jflow';
// import './logic-components/assignment.vue'; // resolve Circular dependencies with logic-node!!!
// import logicNode from './logic-components/logic-node';
import variable from './components/variable.vue';
import start from './components/start.vue';
import end from './components/end.vue';
import endPoint from './components/endpoint.vue';
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getPath(object, condition) {

    function iter(o, p) {
        if (typeof o === 'object') {
            return Object.keys(o).some(function (k) {
                return iter(o[k], p.concat(k));
            });
        }
        if (condition(p[p.length - 1])) {
            path = p;
            return true;
        }
    }

    var path = [];
    iter(object, []);
    return path.join('.');
}
let uniqueId = 0;
export default {
    components: {
        'j-variable': variable,
        'j-start': start,
        'j-end': end,
        'j-endpoint': endPoint,
    },
    data() {
        const ast = {
            body: [
                {
                    type: 'start',
                    id: 'start',
                }, 
                {
                    type: 'variable',
                    content: 'aaaa',
                    id: 'logic1',
                    consequent: [
                        {
                            type: 'variable',
                            content: 'vvvkjhkjhvvvv',
                            id: 'logic5',
                        },
                    ], 
                    alternate: [
                        {
                            type: 'variable',
                            content: 'ggggggg',
                            id: 'logic6',
                            consequent: [
                                // {
                                //     type: 'variable',
                                //     content: 'jkhvvvv',
                                //     id: 'logic77',
                                // },
                            ], 
                            alternate: [
                                // {
                                //     type: 'variable',
                                //     content: 'yuuo',
                                //     id: 'logic88',
                                // },
                            ]
                        },
                    ]
                },  
                {
                    type: 'end',
                    id: 'end',
                },
            ]
        };
        const layout = new Lowcodelayout({
            linkLength: 30,
            ast,
        });
        return {
            ast,
            configs: {
                allowDrop: true,
                layout,
            },
            isHover: false,
            offsetX: 0,
            offsetY: 0,
            currentTarget: null,
            prepareBody: [],
            
        }
    },
    computed: {
        inflowInstances() {
            return this.ast.body.filter(b => !b.outflow)
        }
    },
    mounted() {
        console.log(this.$refs.jflow.getInstance())
    },
    methods: {
        onDragStartRectangle() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: {
                    type: 'variable',
                    content: 'dddd',
                    id: `logic-rec${uniqueId ++}`,
                }
            })
        },
        onDragStartPoint() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: {
                    type: 'variable',
                    content: 'vvvvvvdasdfasfd',
                    id: `logic-point${uniqueId ++}`,
                }
            })
        },
        onOutOfFlow(e, meta) {
            const type = meta.parentIterateType;
            const idx = meta.idx;
            debugger
            const astnode = meta.parent.source[type].splice(idx, 1);
            this.configs.layout.reOrder(this.ast);
            meta.getJflowInstance().anchor = e.detail.point;
            this.$refs.jflow.reflow();
           
        },
        onDrop(e) {
            const astblock = e.detail.instance;
            this.prepareBody.push({
                astblock,
                anchor: e.detail.point,
            });
        },
        onClick(e) {
            const { currentTarget } = e;
            const p = [ 0, currentTarget.height/2 ];
            const gp = currentTarget.calculateToRealWorld(p)
            const [ offsetX, offsetY ] = gp;
            this.isHover = !this.isHover;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
        },
        onPressStart(configs) {
            console.log('pressStart')
            this.currentTarget = configs;
        },
        onPressEnd() {
            console.log('pressEnd')
            this.currentTarget = null;
        },
        onDropToLink(e, linkConfigs) {
            console.log(e, linkConfigs);
            const {
                parent: fromParent,
                idx: fromIdx,
                parentIterateType: fromParentIterateType,
            } = linkConfigs.meta.from;

            const {
                parent: toParent,
                idx: toIdx,
                parentIterateType: toParentIterateType,
            } = linkConfigs.meta.to;
            let idx;
            let type;
            let topNode;
            if(toParent === linkConfigs.meta.from) {
                type = linkConfigs.part;
                idx = toIdx;
                topNode = linkConfigs.meta.from.source;
            } else if(linkConfigs.meta.to.type === 'endpoint'
                && linkConfigs.meta.from.type === 'endpoint'){
                type = 'alternate';
                idx = toParent.source.alternate.length;
                topNode = toParent.source;
            }else if(linkConfigs.meta.from.type === 'endpoint'){
                type = toParentIterateType;
                idx = toIdx;
                topNode = toParent.source;
            } else {
                type = fromParentIterateType;
                idx = fromIdx + 1;
                topNode = fromParent.source;
            } 
            
            debugger
            let node = e.detail.instance;
            if(this.currentTarget) {
                node = this.currentTarget;
            }

            switch (type) {
                case 'body':
                    topNode.body.splice(idx, 0, node)
                    break;
                case 'consequent':
                    topNode.consequent.splice(idx, 0, node)
                    break;
                case 'alternate':
                    topNode.alternate.splice(idx, 0, node)
                    break;
                default:
                    break;
            }
            debugger
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow();



        },
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
.body{
    display: flex;
    flex-direction: horizontal;
}
.sidebar{
    width: 180px;
    border: 2px solid gold;
}
.sidebar > div {
    padding: 16px;
    display: flex;
    justify-content: center;
}

.sidebar > div > div {
    cursor: move;
}

.sidebar > div > .rect {
    width: 80px;
    height: 50px;
    background-color: green;
    text-align: center;
    line-height: 50px;
}

.sidebar > div > .circle {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background-color: hotpink;
    text-align: center;
    line-height: 80px;
}
.hide{
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    -ms-user-drag: none;
    user-drag: none;
}
.hoverblock{
    position: absolute;
    width: 300px;
    height: 300px;
    border: 3px solid gold;
    left: 0;
    top: 0;
    transform: translate(0, 0);
}
</style>
