# JFlow
JFlow 的目标是设计一套架在 canvas 上的轻量级流程图引擎，支持 vue 开发者与 canvas 高级开发人员共同开发。

## Features
目前的实现包含了：
+ 可自由缩放移动的画布
+ 多层级
    + 坐标换算
    + 事件传递机制
    + 布局系统
+ dragdrop
+ vue 框架支持

## Usage
### 原生用法
```javascript
const jflow = new JFlow();
const rectangle = new Rectangle({
    anchor: [0, 0],
    width: 30,
    height: 40,
    color: '#99dbc5'
})
const circle = new Point({
    anchor: [0, 0],
    radius: 10,
    color: '#faaaaa'
})
circle.addEventListener('mouseenter', () => {
    circle.color = 'green'
    jflow._render();
})
circle.addEventListener('mouseleave', () => {
    circle.color = '#99dbc5'
    jflow._render();
})
const group = new Group({
    anchor: [100, 100],
    padding: 10,
    borderColor: '#517cff',
});
group.addToStack(rectangle);
group.addToStack(circle);
jflow.addToStack(group)

jflow.$mount(someElement);
jflow._render();
```
### 与 Vue 配合使用
#### 注册 Vue 插件
```javascript
import { JFlowVuePlugin } from '@joskii/jflow';
import someCustomOriginJFlowInstance from 'path/to/instance';

Vue.use(JFlowVuePlugin, {
    custom: {
        // 自动生成全局注册的 jSomeCustomOriginJFlowInstance 组件
        someCustomOriginJFlowInstance
    }
});
```
#### 模板形式写组件
```vue
<template>
    <j-jflow ref="jflow" 
        :class="$style.wrapper" 
        :configs="configs">
        <j-group 
            name="xxxxx" 
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave" 
            :configs="configs">
            <j-text ref="start" :configs="{
                font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                textColor,
                content: '开始',
            }">
            </j-text>
            <j-point :configs="{
                color: '#99dbc5',
                radius: 11,
            }"></j-point>
        </j-group>
    </j-jflow>
</template>
<script>
export default {
    data() {
        return {
            textColor: '#585c63',
            configs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 0,
                }),
                borderColor: 'transparent',
                borderWidth: 0,
                hoverStyle: 'transparent',
                color: 'transparent',
                hasShrink: false,
                lock: true,
            }
        }
    },
    methods: {
        onMouseEnter(){
            this.textColor = 'red'
        },
        onMouseLeave() {
             this.textColor = '#585c63'
        }
    }
}
</script>
<style module>
.wrapper{
    width: 800px;
    height: 600px;
    border: 1px solid #ccc;
}
</style>
```

#### 布局与具名插槽

[DEMO](vue-demo.html)