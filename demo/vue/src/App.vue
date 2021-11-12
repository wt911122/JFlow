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
                <template v-for="(astblock, idx) in ast.body">
                    <logic-node 
                        :key="astblock.name" 
                        :node="astblock"
                        @outOfFlow="onOutOfFlow($event, astblock, idx)"
                        @pressStart="onPressStart($event, astblock, idx)">
                    </logic-node>
                </template>

                <template v-for="(astblock, idx) in ast.body">
                    <jBezierLink
                        v-if="ast.body[idx + 1]"
                        :key="`${astblock.name}-${ast.body[idx + 1].name}`"
                        :from="astblock.name"
                        :to="ast.body[idx + 1].name"
                        @drop="onDropToLink($event, idx+1, astblock, ast.body[idx + 1])">
                    </jBezierLink>
                </template>
                <template v-for="(prepareAstBlock, idx) in prepareBody">
                    <logic-node 
                        :key="prepareAstBlock.astblock.name" 
                        :initialAnchor="prepareAstBlock.anchor"
                        :node="prepareAstBlock.astblock"
                        @pressStart="onPressStart($event, prepareAstBlock, idx)">
                    </logic-node>
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
                        content: 'vvvvvv',
                        name: 'logiceee'
                    }
                })
        },
        onOutOfFlow(e, astblock, idx) {
            this.ast.body.splice(idx, 1);
            this.prepareBody.push({
                astblock,
                anchor: e.detail.anchor,
            });
            this.$nextTick(() => {
                e.detail.reflowCallback();
            })
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
        onDropToLink(e, idx, fromblock, toblock) {
            if(this.currentTarget) {
                const currentIdx = this.prepareBody.findIndex(b => b === this.currentTarget);
                const [ prepareAstBlock ] = this.prepareBody.splice(currentIdx, 1);
                const insertIdx = this.ast.body.findIndex(b => b === fromblock);
                
                this.ast.body.splice(insertIdx + 1, 0, prepareAstBlock.astblock);
                this.currentTarget = null;
                this.$nextTick(() => {
                    e.detail.reflowCallback();
                })
            } else {
                const {
                    belongs, link, instance
                } = e.detail;
                this.ast.body.splice(idx, 0, instance);
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
