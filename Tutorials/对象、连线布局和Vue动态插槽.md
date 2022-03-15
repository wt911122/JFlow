在定义好布局节点单元、连线单元和布局后，可以将布局应用于jflow，在Vue中使用时，布局节点单元和布局连线单元的```type```会被映射到[```<j-jflow>```](https://wt911122.github.io/JFlow/module-j-jflow.html)组件下的动态插槽中，插槽名称为```type```，布局节点单元和连线单元会以插槽属性(slotProps)的形式传入模板。

以下是一个示例：
```javascript
// 定义几个LayoutNode
class ClassNode{
    get type(){
        return 'ClassNode'
    }
    ...
    makelink(callback) {
        callback({
            type: 'extendsLink',
            ...
        })
    }
}
class MixinNode{
    get type(){
        return 'MixinNode'
    }
    ...
    makelink(callback) {
        callback({
            type: 'mixinLink',
            ...
        })
    }
}
class InterfaceNode{
    get type(){
        return 'InterfaceNode'
    }
    ...
    makelink(callback) {
        callback({
            ...
        })
    }
}
```
在Vue中使用时：
```vue
<template>
    <j-jflow ...>
        <!-- 以下分别对应了三种节点的显示形式 -->
        <!-- typeof slotProps = j-jflow-Node -->
        <template #ClassNode="{ meta }">
            <class-node :node="meta"></class-node>
        </template>
        <template #MixinNode="{ meta }">
            <mixin-node :node="meta"></mixin-node>
        </template>
        <template #InterfaceNode="{ meta }">
            <interface-node :node="meta"></interface-node>
        </template>

        <!-- 以下分别对应了三种连线的显示形式 -->
        <!-- typeof slotProps = Layout~LinkMeta -->
        <template #plainlink="{ configs }">
            <jBezierLink ...></jBezierLink>
        </template>
        <template #mixinLink="{ configs }">
            <jPolyLink ...></jPolyLink>
        </template>
        <template #extendsLink="{ configs }">
            <jOtherLink ...></jOtherLink>
        </template>
    </j-jflow>
</template>
```
## 继续了解
[事件和冒泡](https://wt911122.github.io/JFlow/tutorial-事件与冒泡.html)

