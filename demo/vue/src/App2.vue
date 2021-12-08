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
                <template #start="">
                    <j-start></j-start>
                </template>
                <template #assignment>
                    <j-assignment></j-assignment>
                </template>
                <template #end>
                    <j-end></j-end>
                </template>
        </j-jflow>
        <div ref="hoverblock" :style="`transform: translate(${offsetX}px, ${offsetY}px)`" :class="$style.hoverblock" v-if="isHover">
            HOVER!!!
        </div>
      </div>
  </div>
</template>

<script>
import { LinearLayout, TreeLayout, Rectangle, Point } from '@joskii/jflow';
import './logic-components/assignment.vue'; // resolve Circular dependencies with logic-node!!!
import logicNode from './logic-components/logic-node';
import start from './logic-components/start.vue';
import end from './logic-components/end.vue';
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export default {
    components: {
        logicNode,
        'l-start': start,
        'l-end': end
    },
    data() {
        return {
                configs: {
                    allowDrop: true,
                    layout: new TreeLayout({
                        linkLength: 50,
                    }),
                },
                isHover: false,
                offsetX: 0,
                offsetY: 0,
                currentTarget: null,
                prepareBody: [],
                ast: {
                    body: [
                        {
                            type: 'start',
                            name: 'start',
                        },
                        {
                            type: 'variable',
                            content: 'aaaa',
                            name: 'logic1',
                            consequent: [
                                {
                                    type: 'variable',
                                    content: 'vvvvvvv',
                                    name: 'logic5',
                                },
                            ], 
                            alternate: [
                                {
                                    type: 'variable',
                                    content: 'ggggggg',
                                    name: 'logic6',
                                    consequent: [
                                        {
                                            type: 'variable',
                                            content: 'vvvvvvv',
                                            name: 'logic77',
                                        },
                                    ], 
                                    alternate: [
                                        {
                                            type: 'variable',
                                            content: 'ggggggg',
                                            name: 'logic88',
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            type: 'variable',
                            content: 'ddddggg',
                            name: 'logic3',
                        },
                        {
                            type: 'assignment',
                            name: 'logic2',
                        },
                        {
                            type: 'end',
                            name: 'end',
                        },
                    ]
                },
                graph: {
                    body: [
                        {
                            type: 'start',
                            name: 'start',
                        },
                        {
                            type: 'variable',
                            content: 'aaaa',
                            name: 'logic1',
                            left: {

                            }, 
                            right: {

                            }
                        },
                        {
                            type: 'variable',
                            content: 'ddddggg',
                            name: 'logic3',
                        },
                        {
                            type: 'assignment',
                            name: 'logic2',
                        },
                        {
                            type: 'end',
                            name: 'end',
                        },
                    ],
                    links: [
                        { from: 'start', to: 'logic1' },
                        // { from: 'start', to: 'logic2' },
                        { from: 'logic1', to: 'logic2' },
                        { from: 'start', to: 'logic3' },
                        { from: 'logic2', to: 'logic3' },
                        { from: 'logic3', to: 'end' },
                    ]
                }
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
                    type: 'text',
                    content: 'dddd',
                    name: 'logic4sa'
                }
            })
        },
        onDragStartPoint() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: {
                    type: 'variable',
                    content: 'vvvvvvdasdfasfd',
                    name: 'logiceee',
                }
            })
        },
        onOutOfFlow(e, astblock) {
            debugger
            const idx = this.graph.body.findIndex(b => b === astblock);
            const [out] = this.graph.body.splice(idx, 1);
            const fromInstances = [];
            const toInstances = [];
            const removelinks = [];
            const target = out.name;
            const newLinks = [];
            this.graph.links.forEach(l => {
                if(l.from === target){
                    toInstances.push(l.to);
                } else if(l.to === target){
                    fromInstances.push(l.from);
                } else {
                    newLinks.push(l);
                }
            })
            
            // 暂且全连接吧
            fromInstances.forEach(f => {
                toInstances.forEach(t => {
                    const finded = newLinks.find(l => l.from === f && l.to === t);
                    if(!finded) {
                        newLinks.push({
                            from: f,
                            to: t,
                        })
                    }
                });
            });
            this.graph.links = newLinks;
            debugger
            this.prepareBody.push({
                astblock: out,
                anchor: e.detail.anchor,
            });
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
        onPressStart(e, astblock, idx ) {
            this.currentTarget = astblock;
        },
        onPressEnd() {
            this.currentTarget = null;
        },
        onDropToLink(e, link) {
            if(this.currentTarget) {
                const currentIdx = this.prepareBody.findIndex(b => b === this.currentTarget);
                const [ prepareAstBlock ] = this.prepareBody.splice(currentIdx, 1);
                const instance = prepareAstBlock.astblock;
                this.graph.body.push(instance)
                const idx = this.graph.links.findIndex(l => l === link);
                debugger
                this.graph.links.splice(idx, 1, {
                    from: link.from,
                    to: instance.name,
                },{
                    from: instance.name,
                    to: link.to,
                });

                this.currentTarget = null;
            } else {
                const {
                    belongs, instance
                } = e.detail;
                this.graph.body.push(instance);
                const idx = this.graph.links.findIndex(l => l === link);
                this.graph.links.splice(idx, 1, {
                    from: link.from,
                    to: instance.name,
                },{
                    from: instance.name,
                    to: link.to,
                })
            }
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
