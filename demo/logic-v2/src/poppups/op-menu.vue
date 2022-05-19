<template>
    <div :class="$style.root">
        <div :class="$style.title">
            {{ meta.concept }}
        </div>
        <ul :class="$style.list">
            <li @click="removeNode">
                <span>删除</span>
            </li>
        </ul>
    </div>
</template>

<script>
import {
    ConceptColorMap,
    ConceptSubColorMap,
    ConceptIconURLMap,
} from '../configs';
import { genNode } from "../data/data";
function getList() {
    return [
        "Assignment",
        "ForEach",
        "Switch",
        "While",
        "If"
    ].map(c => ({
        concept: c,
        color: ConceptColorMap[c],
        subcolor: ConceptSubColorMap[c],
        icon: ConceptIconURLMap[c],
    }))
}

export default {
    inject: ['reOrderAndReflow', 'closePopper'],
    props: {
        meta: Object,
    },
    data() {
        return {
            list: getList(),
        }
    },
    methods: {
        removeNode() {
            const layoutNode = this.meta.target;
            layoutNode.delete();
            this.reOrderAndReflow();
            this.closePopper();
        }
    }
}
</script>

<style module>
.root {
    background: #fff;
    border: 1px solid #E0E0E0;
}
.title {
    color: #C4C4C4;
    border-bottom: 1px solid #E0E0E0;
    padding: 10 12;
}
.list{ 
    list-style: none;
    padding-left: 10px
}
.list > li { 
    list-style-type: none;
    padding: 10px 12px;
    cursor: pointer;;
}
.list > li:hover { 
    background: #E0E0E0;
}
.icon { 
    width: 18px;
}
</style>