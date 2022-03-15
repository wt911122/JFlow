可以从以下几处扩展JFlow:
## 绘图单元
通过继承 {@link Node} 或者 {@link BaseLink}，实现必要的方法，来拓展绘图单元，比如实现三角箭头：

```javascript
import { Node } from '@joskii/jflow';
// 夹角为 90 度好了 1/sqrt(2)
const cosAngle = 0.7071;
const sinAngle = 0.7071;
class Angle extends Node {
    constructor(configs) {
        super(configs);
        this.wing = configs.wing || 6;
        this.rotation = configs.rotation || 0;
        this._cacheWingPoint();
    }
    // Vue 插件调用这个方法来更新配置
    setConfig(configs) {
        Object.keys(configs).forEach((k) => {
            if (configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
            }
        });
        if (this.wing !== configs.wing) {
            this._cacheWingPoint();
        }
    }

    _cacheWingPoint() {
        const w = this.wing;
        const y = w * cosAngle / 2;
        const x = w * sinAngle;
        this.width = x * 2;
        this.height = x * 2;
        this._cachePoints = [
            [x, -y],
            [0, y],
            [-x, -y],
        ];
    }

    // JFlow 绘制函数，入参是 CanvasRenderingContext2D
    render(ctx) {
        ctx.save();
        ctx.beginPath();

        const [x, y] = this.anchor;
        const [a, b, c] = this._cachePoints;
        const rotateInRadios = this.rotation * Math.PI / 180;
        ctx.translate(x, y);
        ctx.rotate(rotateInRadios);
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        if (this.borderWidth && this.borderColor) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }
        ctx.rotate(-rotateInRadios);
        ctx.translate(-x, -y);
        ctx.restore();
    }

    // 鼠标点击检测，point已换算成当前组坐标系下的坐标了
    isHit(point) {
        return false;
    }
    // 最小外接矩形
    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width / 2;
        const h = this.height / 2;
        const ltx = anchor[0] - w;
        const lty = anchor[1] - h;
        const rbx = anchor[0] + w;
        const rby = anchor[1] + h;
        return [
            [ltx, lty],
            [rbx, lty],
            [rbx, rby],
            [ltx, rby],
        ];
    }
    // 维度
    getBoundingDimension() {
        return {
            height: this.height,
            width: this.width,
        };
    }
}
```
当然也可以通过继承已有的一些形状来省略部分方法的实现，比如实现一个三个点的按钮
```javascript
import { Rectangle } from '@joskii/jflow';
// 继承了 Rectangle，复用了会矩形的设定
class Dot3 extends Rectangle {
    constructor(configs) {
        super(configs);
        this.width = 4;
        this.height = 14;
    }

    setConfig(configs) {
        Object.keys(configs).forEach((k) => {
            if (configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
            }
        });
    }

    render(ctx) {
        ctx.save();
        ctx.beginPath();

        const [x, y] = this.anchor;
        ctx.fillStyle = this.backgroundColor;
        ctx.arc(x, y - 5, 1, 0, 2 * Math.PI);
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.arc(x, y + 5, 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}
export default Dot3;
```

在Vue中，可以在通过插件配置注入新的组件

```javascript
Vue.use(JFlowVuePlugin, {
    custom: {
        Angle,
        Dot3,
    },
});
```
之后就可以在工程中通过标签正常使用了，configs传入对象具体的setConfigs函数
```vue
<template>
    <j-angle :configs="{
        wing: 6,
        borderWidth: 1.5,
        borderColor: '#999',
        rotation: 180,
    }"></j-angle>
</template>
```
```vue
<template>
    <j-dot3 :configs="{
        backgroundColor: '#323747',
    }"></j-dot3>
</template>
```
    


## 点线布局和组布局
参考 
+ [对象、连线和布局](https://wt911122.github.io/JFlow/tutorial-对象、连线和布局.html)
+ [组与组布局](https://wt911122.github.io/JFlow/tutorial-组与组布局.html)

## 事件监听策略
通过自定义事件映射关系来满足不同的交互需求。默认的交互为 https://github.com/wt911122/JFlow/blob/90deff93a65b84a9664b88a929066ed4b8f14e7f/src/core/events/adapter.js#L18

自定义事件监听策略可参考 https://github.com/wt911122/JFlow/blob/master/src/core/events/commonAdapter.js 来制定。

