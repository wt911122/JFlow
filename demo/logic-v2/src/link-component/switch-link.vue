<template>
   <j-switch-case-link
        :configs="configs"
        @instancemousemove="setPointerCursor"
        @click="onClick"
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
    computed: {
        configs() {
            // console.log(this.linkConfigs.bendPoint)
            return {
                ...this.linkConfigs,
                backgroundColor: '#4C88FF',
            };
        },
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
        }
    }
}
</script>

<style>

</style>