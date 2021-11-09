import InstanceStack from './stack';
// import Link from './link';
import Link from './polyline-link';
import { setUniqueId, getUniqueId } from '../utils/functions';

const StackMixin = {
    instances: [],
    links: [],
    _stack: null,
    _linkStack: null,
    initStack({ data }) {
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

    addToStack(instance) {
        instance._belongs = this;
        this._stack.push(instance);
        this.recalculate()
    },

    replaceFromStack(target, instance) {
        const index = this._stack.findIndex(i => i === target);
        this._stack.splice(index, 1, instance);
        target._belongs = null;
        instance._belongs = this;
        this.recalculate()
    },

    addToLinkStack(link) {
        link._belongs = this;
        this._linkStack.push(link);
    },

    removeFromStack(target) {
        const index = this._stack.findIndex(i => i === target);
        this._stack.splice(index, 1);
        this.recalculate()
    },
    removeFromLinkStack(target) {
        const index = this._linkStack.findIndex(i => i === target);
        this._linkStack.splice(index, 1);
    },

    removeLinkOnInstance(target) {
        const fromInstances = [];
        const toInstances = [];
        const removelinks = [];
        let _constuctor;
        this._linkStack.forEach(l => {
            if(l.from === target){
                toInstances.push(l.to);
                _constuctor = l.__proto__.constructor;
                removelinks.push(l);
            }
            if(l.to === target){
                fromInstances.push(l.from);
                _constuctor = l.__proto__.constructor;
                removelinks.push(l);
            }  
        })
        
        removelinks.forEach(l => {
            this.removeFromLinkStack(l);
        });
        // 暂且全连接吧
        fromInstances.forEach(f => {
            toInstances.forEach(t => {
                this.addToLinkStack(new _constuctor({
                    from: f, 
                    to: t
                }))
            });
        });
        return {
            fromInstances,
            toInstances,
            removelinks,
        }
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
    }
    // reLayout() {
    //     this.reflow();
    //     this._getBoundingGroupRect();
    //     if(this._belongs) {
    //         this._belongs.reLayout();
    //     }
    // }
    // addToTempStack(instance) {
    //     this._tempStack.push(instance);
    // },

    // truncateTempStack() {
    //     let temp;
    //     if(this._tempStack) {
    //         temp = this._tempStack.slice();
    //     }
    //     this._tempStack = new InstanceStack();
    //     return temp;
    // }

}

export default StackMixin;