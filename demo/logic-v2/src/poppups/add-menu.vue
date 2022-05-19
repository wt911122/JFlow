<template>
    <div :class="$style.root">
        <div :class="$style.title">
            建议添加逻辑
        </div>
        <ul :class="$style.list">
            <li v-for="config in list" 
                :key="config.concept"
                @click="addConceptNode(config.concept)">
                <img :src="config.icon" :class="$style.icon" />
                <span>{{config.concept}}</span>
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
        addConceptNode(c) {
            const node = genNode(c);
            const linkConfigs = this.meta.target;
            linkConfigs.from.linkSource(node, linkConfigs);
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