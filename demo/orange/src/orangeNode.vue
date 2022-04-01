<template>
    <j-point-group
        ref="root"
        :source="node"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        @click="onClick"
        @link="onLink"
        :configs="{
            borderColor: '#EB6864',
            backgroundColor: isHover ? '#EB6864' :'transparent',
            borderWidth: 2,
            padding: 20,
        }">
        <j-text :configs="{
            fontSize: '12px',
            textColor: isHover ? '#fff' : '#000',
            content: node.id,
        }">
        </j-text>
    </j-point-group>
</template>

<script>
import { BezierLink } from '@joskii/jflow';
export default {
    props: {
        node: Object
    },
    inject: ['renderJFlow'],
    data() {
        return {
            isHover: false
        }
    },
    updated() {
        this.renderJFlow();
    },
    methods: {
        onClick(event) {
            console.log('click')
            const jflow = event.detail.jflow;
            jflow.setLinkingMode(
                this.node,
                (configs) => {
                    return new BezierLink({
                        ...configs,
                        backgroundColor: '#EB6864',
                    })
                });
        },
        onLink(event) {
            console.log('onLink', event)
            event.detail.bubbles = false;
            const source = event.detail.payload.instance;
            this.$emit('toLink', {
                source,
                target: this.node,
            })
        }
    }
}
</script>

<style>

</style>