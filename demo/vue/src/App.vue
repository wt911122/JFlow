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
      <j-jflow ref="jflow" :class="$style.wrapper" :configs="configs">
            <l-start name="start"></l-start>
            <l-assignment name="assignment" />
            <l-block name="block" subTitle="调用接口">
                <template #header>
                    <l-header1 />
                </template>
                <template #content>
                    <j-selector :configs="{ width: 280 }"/>
                </template>
            </l-block>
            <l-end name="end"></l-end>

            <jBezierLink from="start" to="assignment" />
            <jBezierLink from="assignment" to="block" />
            <jBezierLink from="block" to="end" />
      </j-jflow>
  </div>
</template>

<script>
import { LinearLayout, TreeLayout, Rectangle, Point } from '@joskii/jflow';
import Start from './logic-components/start.vue';
import End from './logic-components/end.vue';
import Assignment from './logic-components/assignment.vue';
import Block from './logic-components/block.vue';
import Header1 from './logic-components/header1.vue';
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
      'l-start': Start,
      'l-end': End,
      'l-assignment': Assignment,
      'l-block': Block,
      'l-header1': Header1,
  },
  data() {
      return {
          configs: {
                allowDrop: true,
                layout: new TreeLayout({
                    linkLength: 50,
                }),
          },
      }
  },
  methods: {
      onDragStartRectangle() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
                instance: new Rectangle({
                    content: 'Rectangle',
                    width: 80,
                    height: 280,
                    color: 'green',
                }) 
            })
      },
      onDragStartPoint() {
            const jflowInstance = this.$refs.jflow.getInstance();
            jflowInstance.sendMessage({ 
               instance: new Point({
                    content: 'circle',
                    radius: 40,
                    color: 'hotpink',
                })
            })
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
</style>
