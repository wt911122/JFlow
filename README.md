# JFlow
JFlow 的目标是设计一套基于 canvas 的轻量级流程图引擎，支持 vue 开发者与 canvas 高级开发人员共同开发。

[导引](https://wt911122.github.io/JFlow/tutorial-开始.html)
[DEMO](https://wt911122.github.io/JFlow/vue-demo.html)

[LOGIC-DEMO](https://wt911122.github.io/JFlow/logic-v2-demo.html)
## Features
目前的实现包含了：
+ 可自由缩放移动的画布
+ 多层级
    + 坐标换算
    + 事件冒泡
    + 布局系统
+ dragdrop
+ vue 框架支持

## Motivation
在设计实现过程中，我一直在问自己一个问题，在关于点线图的业务开发过程中，什么是业务开发者需要关心的，什么是框架维护者需要提供的。在开发过程中，这个答案逐渐明晰了起来，业务开发者关心的是：

+ 自己处理的数据结构与图上的一个直接映射关系
+ 能够方便的对用户行为的监听和处理

并不关心的是：
+ 点与线是如何连接的
+ 坐标是如何换算的
+ 事件是如何抛出的

而这些就是JFlow应该去解决的问题


