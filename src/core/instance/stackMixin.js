import InstanceStack from './stack';
import { addReflowWork } from '../dirty-work/dirty-work';

// import { setUniqueId, getUniqueId } from '../utils/functions';
/**
 * 对象栈 mixin 用于方便控制节点栈和连线栈
 *
 * @mixin
 */
const StackMixin = {
    /** @property {Node[]}          - 对象数组 */
    instances: [],
    /** @property {BaseLink[]}      - 连线数组 */
    links: [],
    /** @property {InstanceStack}       - 对象栈 */
    _stack: null,
    /** @property {InstanceStack}       - 连线栈 */
    _linkStack: null,
    /**
     * 初始化对象栈
     * @param {JflowConfigs} configs - 配置
     */
    initStack({ data } = {}) {
        this._stack = new InstanceStack();
        this._linkStack = new InstanceStack();
        if(!data) return;
        this.instances = data.instances;
        this.links = data.links;
        this.instances.forEach(i => { 
            this._stack.push(i);
            i._belongs = this;
        })
        this.links.forEach((link) => {
            this._linkStack.push(link);
            link._belongs = this;
        });
    },
    /**
     * 加入节点对象
     * @param {Node} instance - 节点对象
     */
    addToStack(instance) {
        // console.log('-----addToStack----', instance)
        instance._belongs = this;
        this._stack.push(instance);
        addReflowWork(instance, this);
        // this.recalculate()
    },

    insertToStackBefore(instance, anchorNode) {
        // console.log('-----insertToStackBefore----')
        if(instance._belongs) {
            instance._belongs.removeFromStack(instance);
        }
        instance._belongs = this;
        const idx = this._stack.findIndex(s => s === anchorNode);
        if(idx !== -1) {
            this._stack.splice(idx, 0, instance)
            addReflowWork(instance, this);
        } else {
            this.addToStack(instance);
        }
    },
    /**
     * 替换对象
     * @param {Instance} target - 被替换的对象
     * @param {Instance} instance - 替换对象
     */
    replaceFromStack(target, instance) {
        const index = this._stack.findIndex(i => i === target);
        this._stack.splice(index, 1, instance);
        target._belongs = null;
        instance._belongs = this;
        // this.recalculate()
    },
    /**
     * 加入连线对象
     * @param {BaseLink} instance - 连线对象
     */
    addToLinkStack(link) {
        if(this._linkStack.find(l => l === link)) {
            return;
        }
        link._belongs = this;
        this._linkStack.push(link);
    },
    /**
     * 删除节点对象
     * @param {Node} target - 节点对象
     */
    removeFromStack(target) {
        // console.log('-----removeFromStack----')
        // this.removeLinkOnInstance(target);
        const index = this._stack.findIndex(i => i === target);
        if(index !== -1) {
            this._stack.splice(index, 1);
            addReflowWork(this);
        }
        // this.recalculate()
    },
    /**
     * 删除连线对象
     * @param {Node} target - 连线对象
     */
    removeFromLinkStack(target) {
        const index = this._linkStack.findIndex(i => i === target);
        if(index !== -1) {
            this._linkStack.splice(index, 1);
        }
    },
   
    emptyLink() {
        this._linkStack = new InstanceStack();
    },
    /**
     * 重置当前栈中对象的位置
     */
    resetChildrenPosition() {
        this._stack.forEach(i => {
            i.anchor = [0,0]
        });
    },

    addInstanceToLink(targetLink, instance) {
        this.addToStack(instance);
        const { from, to } = targetLink;
        const index = this._linkStack.findIndex(l => l === targetLink);
        const _constuctor = targetLink.__proto__.constructor;
        const l1 = new _constuctor({
            from, 
            to: instance,
        });
        l1._belongs = this;
        const l2 = new _constuctor({
            from: instance, 
            to,
        });
        l2._belongs = this;

        this._linkStack.splice(index, 1, l1, l2);
    },
    
    /**
     * 循环当前栈中节点
     * @property {stackIteratorCallback} 循环访问栈中每个节点
     */
    interateNodeStack(callback) {
        this._stack.forEach(instance => {
            callback(instance);
        })
    }   
    /**
    * 循环访问栈中每个节点
    * @callback stackIteratorCallback
    * @param {Node} instance 栈中节点
    */
}

export default StackMixin;