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
                <template #IfStatement="{ configs, meta }">
                    <j-ifstatement :node="{ name: configs.id, content: configs.content }" 
                    @pressStart="onPressStart(configs)" 
                    @outOfFlow="onOutOfFlow($event, meta)"></j-ifstatement>
                </template>
                <template #SwitchStatement="{ configs, meta }" >
                    <j-switch :node="{ name: configs.id, content: configs.id, cases: configs.cases }" 
                    @pressStart="onPressStart(configs)" 
                    @outOfFlow="onOutOfFlow($event, meta)"/>
                </template>
                <template #WhileStatement="{ configs, meta }">
                    <j-whilestatement :node="{ name: configs.id, content: configs.content }" 
                    @pressStart="onPressStart(configs)" 
                    @outOfFlow="onOutOfFlow($event, meta)"></j-whilestatement>
                </template>
                <template #endpoint="{ configs }">
                    <j-endpoint :node="{ name: configs.id }"></j-endpoint>
                </template>
                <template #plainlink="{ configs }">
                    <jBezierLink
                        :configs="configs"
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
import ifStatement from './components/ifstatement.vue';
import start from './components/start.vue';
import end from './components/end.vue';
import endPoint from './components/endpoint.vue';
import switchComp from './components/switch.vue'; 
import whileComp from './components/whilestatement.vue';
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
        'j-switch': switchComp,
        'j-ifstatement': ifStatement,
        'j-whilestatement': whileComp,
    },
    data() {
        const ast = {
            type: 'Root',
            body: [
                {
                    type: 'start',
                    id: 'start',
                }, 
                {
                    type: 'IfStatement',
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
                            type: 'IfStatement',
                            content: 'ggggggg',
                            id: 'logic6',
                            consequent: [
                                {
                                    type: 'variable',
                                    content: 'jkhvvvv',
                                    id: 'logic77',
                                },
                            ], 
                            alternate: [
                                {
                                    type: 'variable',
                                    content: 'yuuo',
                                    id: 'logic88',
                                },
                            ]
                        },
                    ]
                },
                {
                    type: 'SwitchStatement',
                    id: 'swtch1',
                    cases: [
                        {
                            type: 'SwitchCase',
                            id: 'switchcase11',
                            content: 'switchcase11',
                            alternate: [
                                {
                                    type: 'variable',
                                    content: 'yuuo',
                                    id: 'sc1111122',
                                },
                            ]
                        },
                        {
                            type: 'SwitchCase',
                            id: 'switchcase12',
                            content: 'switchcase12',
                            alternate: [
                                {
                                    type: 'variable',
                                    content: 'asdfag',
                                    id: 'sc12344455',
                                },
                            ],
                            consequent: [
                                {
                                    type: 'variable',
                                    content: 'dfhsdfg',
                                    id: 'sc125444',
                                },
                            ],
                        }
                    ]
                },
                {
                    type: 'WhileStatement',
                    id: 'while1',
                    content: 'while1',
                    body: [
                        // {
                        //     type: 'variable',
                        //     content: 'dfhsdfg',
                        //     id: 'whiel1body1',
                        // },
                    ]
                },
                {
                    type: 'end',
                    id: 'end',
                },
            ],
            playground: [],
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
                    type: 'IfStatement',
                    content: `IfStatement-rec${uniqueId ++}`,
                    id: `IfStatement-rec${uniqueId ++}`,
                    consequent: [], 
                    alternate: [],
                    
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
            const [astnode] = meta.parent.source[type].splice(idx, 1);
            this.ast.playground.push(astnode);
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow();
            meta.getJflowInstance().anchor = e.detail.point;    
        },
        onDrop(e) {
            const astblock = e.detail.instance;
            this.ast.playground.push(astblock);
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow(() => {
                const meta = this.configs.layout.findLayoutNode(astblock);
                if(meta) {
                     meta.getJflowInstance().anchor = e.detail.point;
                }
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
            console.log(configs);
            this.currentTarget = configs;
        },
        onPressEnd() {
            console.log('pressEnd')
            this.currentTarget = null;
        },
        onDropToLink(e, linkConfigs) {
            console.log(e, linkConfigs);
            let node = e.detail.instance;
            if(this.currentTarget) {
                node.removeFromLayoutSource();
                node = this.currentTarget;
            }

            linkConfigs.meta.from.linkSource(node, linkConfigs);
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
