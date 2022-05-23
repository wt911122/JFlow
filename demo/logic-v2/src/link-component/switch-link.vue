<template>
   <j-switch-case-link
        :configs="configs"
        @instancemousemove="setPointerCursor"
        @click="onClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        :from="linkConfigs.from.source"
        :to="linkConfigs.to.source">
    </j-switch-case-link>
</template>

<script>
import { genNode } from "../data/data";
export default {
    inject: ['renderJFlow', 'reOrderAndReflow'],
    props: {
        linkConfigs: Object,
    },
    data() {
        return {
            showAdd: false,
        }
    },
    computed: {
        configs() {
            // console.log(this.linkConfigs.bendPoint)
            return {
                ...this.linkConfigs,
                showAdd: this.showAdd,
                backgroundColor: this.showAdd ? '#4C88FF' : '#919499',
            };
        },
    },
    updated() {
        this.renderJFlow();
    },
    methods: {
        setPointerCursor($event) {
            $event.detail.jflow.canvas.style.cursor = 'pointer';
            $event.detail.bubbles = false;
        },
        onClick() {
            const node = genNode('SwitchCase');
            this.linkConfigs.from.linkSource(node, this.linkConfigs);
            this.reOrderAndReflow();
        },
        onMouseEnter() {
            console.log('enter')
            this.showAdd = true;
        },
        onMouseLeave() {
             console.log('leave')
            this.showAdd = false;
        },
    }
}
</script>

<style>

</style>