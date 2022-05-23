<template>
  <div id="app" :class="$style.body">
      <div :class="$style.sidebar">
        <div>
            <div draggable="true" :class="$style.part" type="IfStatement" @dragstart="onDragStartRectangle">IfStatement</div>
        </div>
        <div>
            <div draggable="true" :class="$style.part" type="variable" @dragstart="onDragStartPoint">Variable</div>
        </div>
        <div>
            <div draggable="true" :class="$style.part" type="jsblock" @dragstart="onDragjsBlock">jsBlock</div>
        </div>
      </div>
      <div style="position: relative;">
        <j-jflow ref="jflow" 
            :class="$style.wrapper" 
            :configs="configs"
            :loading.sync="jflowloading"
            :genVueComponentKey="genVueComponentKey"
            @click="onClickNoWhere"
            @drop="onDrop"
            @pressEnd="onPressEnd">
                <template #start="{ source }">
                    <j-start :node="source"></j-start>
                </template>
                <template #end="{ source }">
                    <j-end :node="source"></j-end>
                </template>
                <template #variable="{ source }">
                    <j-variable :node="source" 
                    @pressStart="onPressStart(source)" 
                    @outOfFlow="onOutOfFlow($event, source)"
                    @change="onChangeContent($event, source)"></j-variable>
                </template>
                <template #IfStatement="{ source }">
                    <j-ifstatement 
                        :node="source" 
                        @pressStart="onPressStart(source)" 
                        @outOfFlow="onOutOfFlow($event, source)"></j-ifstatement>
                </template>
                <template #SwitchStatement="{ source }" >
                    <j-switch :node="source" 
                    @pressStart="onPressStart(source)" 
                    @outOfFlow="onOutOfFlow($event, source)"/>
                </template>
                <template #WhileStatement="{ source }">
                    <j-whilestatement :node="source" 
                    @pressStart="onPressStart(source)" 
                    @outOfFlow="onOutOfFlow($event,source )"></j-whilestatement>
                </template>
                <template #endpoint="{ source }">
                    <j-endpoint :node="source"></j-endpoint>
                </template>
                <template #CallLogic="{ source }" >
                    <j-calllogic 
                        :node="source"
                        @toggle-select="onToggleSelect($event, source)"
                        @pressStart="onPressStart(source)" 
                        @outOfFlow="onOutOfFlow($event, source)">
                    </j-calllogic>
                </template>
                <template #JSblock="{ source }">
                    <j-jsblock :node="source"
                    @pressStart="onPressStart(source)" 
                    @outOfFlow="onOutOfFlow($event, source)"
                    @demojsblock="onclickdemojsblock"
                    @change="onContentChange($event, source)">
                    </j-jsblock>
                </template>
                <template #plainlink="{ configs }">
                    <instance-link
                        :linkConfigs="configs"
                        @drop="onDropToLink($event, configs)">
                    </instance-link>
                </template>
        </j-jflow>
        <div ref="hoverblock" 
            :style="`transform: translate(${offsetX}px, ${offsetY}px)`" 
            :class="$style.hoverblock"
             v-if="isHover">
            <ul>
                <li v-for="l in logics" :key="l.content"
                    @click="onSelectLogic(l)">{{l.content}}</li>
            </ul>
        </div>
      </div>
      <!-- <div :class="$style.ast">
          <pre v-html="prettyJson(ast)"></pre>
      </div> -->
  </div>
</template>

<script>
import { prettyPrintJson } from 'pretty-print-json';
import { LinearLayout, Lowcodelayout, Rectangle, Point, commonEventAdapter } from '@joskii/jflow';
// import './logic-components/assignment.vue'; // resolve Circular dependencies with logic-node!!!
// import logicNode from './logic-components/logic-node';
import variable from './components/variable.vue';
import ifStatement from './components/ifstatement.vue';
import start from './components/start.vue';
import end from './components/end.vue';
import endPoint from './components/endpoint.vue';
import switchComp from './components/switch.vue'; 
import whileComp from './components/whilestatement.vue';
import CallLogicComp from './components/callLogic.vue';
import instanceLink from './components/instance-link.vue';
import JSBlockComp from './components/jsBlock.vue';
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
console.log(commonEventAdapter)
let uniqueId = 0;
let uuuuid = 0;
function getuuuuid() {
    return uuuuid++;
}
function makeAst(number) {
    const ast = { type: 'Root', body: [ { type: 'start', id: 'start' }, ], playground: [] }
    function randomVariable() {
        const id = getuuuuid();
        return {
            type: 'variable',
            content: `variable-${id}`,
            id: `variable${id}`,
        };
    }

    function randomCallLogic() {
        const id = getuuuuid();
        return {
            type: 'CallLogic',
            id: `CallLogic-${id}`,
            content: `CallLogic-${id}`,
            params: [],
        }
    }
    
    function randomIFstatement() {
        const id = getuuuuid();
        return {
            type: 'IfStatement',
            content: `IfStatement-${id}`,
            id: `IfStatement-${id}`,
            consequent: [randomVariable()],
            alternate: [randomVariable()],
        }
    }
    let lastObj = ast.body;
    function randomStateMachine() {
        const p = Math.floor(Math.random() * 10);
        let b;
        switch (p) {
            case 0:
            case 1:
                b = randomIFstatement();
                lastObj.push(b);
                const d = Math.floor(Math.random() * 2);
                lastObj = (d === 0 ? b.consequent: b.alternate)
                break;
            case 2:
            case 3:
            case 4:
            case 5:
                b = randomCallLogic();
                lastObj.push(b);
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                b = randomVariable();
                lastObj.push(b);
                break;
        }
    }

    while(number--){
        randomStateMachine();
    }
    return ast;
}
const astrandom = makeAst(1000)
// console.log(astrandom)
export default {
    components: {
        'j-variable': variable,
        'j-start': start,
        'j-end': end,
        'j-endpoint': endPoint,
        'j-switch': switchComp,
        'j-ifstatement': ifStatement,
        'j-whilestatement': whileComp,
        'j-calllogic': CallLogicComp,
        'j-jsblock': JSBlockComp,
        instanceLink,
    },
     provide() {
        return {
            renderJFlow: this.renderJFlow,
        }
     },
    data() {
        const ast = {
            type: 'Root',
            body: [
                // {
                //             type: 'variable',
                //             content: 'vvvkjhkjhvvvv',
                //             id: 'logic5',
                //         },
                {
                    type: 'start',
                   
                    id: 'start',
                }, 
                {
                    type: 'variable',
                    content: 'vvvkjhkjhvvvv',
                    id: 'logic5',
                },
                // {
                //     type: 'JSblock',
                //     id: 'JSblock',
                //     content: `function(args) {
                //         console.log("hello world!");
                //     }`
                // },
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
            /* {
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
                        {
                            type: 'CallLogic',
                            id: 'CallLogic1',
                            content: '',
                            params: [],
                        }
                    ]
                },*/
                /* {
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
                        {
                            type: 'variable',
                            content: 'dfhsdfg',
                            id: 'whiel1body1',
                        },
                    ]
                },*/
                {
                    type: 'end',
                    id: 'end',
                },
            ],
            playground: [],
        };
        const layout = new Lowcodelayout({
            linkLength: 60,
            ast,
        });
        this.ast = ast;
        const configs = Object.freeze({
            allowDrop: true,
            layout,
            initialZoom: 1,
            minZoom: .2,
            setInitialPosition(realboxX, realboxY, realboxW, realboxH, c_x, c_y, c_width, c_height) {
                return {
                    x: realboxX + c_width / 2,
                    y: c_y
                }
            }
        })
        return {
            configs,
            isHover: false,
            offsetX: 0,
            offsetY: 0,
            currentTarget: null,
            prepareBody: [],
            jflowloading: false,
            logics: [{
                content: 'aaa',
                params: [{
                    content: 'p1',
                }],
            }, {
                content: 'vvvv',
                params: [{
                    content: 'p1',
                }, {
                    content: 'p2',
                }],
            }, {
                content: 'sadasdf',
                params: [{
                    content: 'p1',
                }],
            },{
                content: 'ggggg',
                params: [{
                    content: 'p1',
                },{
                    content: 'p2',
                },{
                    content: 'p3',
                }],
            }],
            currentEditingTarget: null,
        }
    },
    computed: {
        inflowInstances() {
            return this.ast.body.filter(b => !b.outflow)
        }
    },
    watch: {
        jflowloading(val) {
            console.log(Date.now())
            console.log(val);
        }
    },
    methods: {
        prettyJson() {
            return prettyPrintJson.toHtml(this.ast);
        },
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
        onDragjsBlock() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: {
                    type: 'JSblock',
                    id: `JSblock-${uniqueId ++}`,
                    content: `function(args) {
                        console.log("hello world!");
                    }`
                },
            })
        },
        onOutOfFlow(e, source) {
            const jflowInstance = this.$refs.jflow.getInstance();
            const layoutNode = jflowInstance.getLayoutNodeBySource(source);
            layoutNode.remove();
            this.ast.playground.push(source);
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow();
            jflowInstance.getRenderNodeBySource(source).anchor = e.detail.point;
            // meta.getJflowInstance().anchor = e.detail.point;    
        },
        onDrop(e) {
            const jflowInstance = this.$refs.jflow.getInstance();
            const astblock = e.detail.instance;
            this.ast.playground.push(astblock);
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow(() => {
                jflowInstance.getRenderNodeBySource(astblock).anchor = e.detail.point;
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
        onPressStart(source) {
            this.currentTarget = source;
        },
        onPressEnd() {
            this.currentTarget = null;
        },
        onDropToLink(e, linkConfigs) {
            const jflowInstance = this.$refs.jflow.getInstance();
            let node = e.detail.instance;
            if(this.currentTarget) {
                node = this.currentTarget;
                const layoutNode = jflowInstance.getLayoutNodeBySource(node);
                layoutNode.remove();
            }
            linkConfigs.from.linkSource(node, linkConfigs);
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow();
        },
        onToggleSelect(event, configs) {
            const [offsetX, offsetY] = event;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.isHover = !this.isHover;
            if(this.isHover) {
                this.currentEditingTarget = configs
            } else {
                this.currentEditingTarget = null;
            } 
        },
        onSelectLogic(c) {
            this.isHover = false
            console.log(this.currentEditingTarget)
            this.currentEditingTarget.content = c.content;
            this.currentEditingTarget.params = c.params;
        },
        onClickNoWhere() {
            this.isHover = false
            this.currentEditingTarget = null;
        },
        onChangeContent($event, configs){
            configs.content = $event.val;
        },
        renderJFlow() {
            this.$refs.jflow.renderJFlow();
        },
        onclickdemojsblock() {
            this.ast.body.splice(1, 1);
            this.configs.layout.reOrder(this.ast);
            this.$refs.jflow.reflow();
        },
        onContentChange(content, configs) {
            configs.content = content;
            console.log(content, configs)
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
    width: 960px;
    height: 770px;
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

.sidebar > div > .part {
    width: 80px;
    height: 50px;
    border: 2px solid #517cff;
    border-radius: 8ox;
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
.ast {
    flex: 1;
    border: 2px solid gold;
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
    background: #fff;
    width: 300px;
    height: 300px;
    border: 3px solid gold;
    left: 0;
    top: 0;
    transform: translate(0, 0);
}
.hoverblock > ul > li{
    cursor: pointer;
}
.hoverblock > ul > li:hover{
    background: #eee;
}
</style>
