<template>
    <!-- jflowId 就是 layoutNode 中 ID -->
    <j-scroll-group 
        :source="node"
        :configs="configs">
        <j-group :configs="innerConfig">
            <j-text 
                @mouseenter="isenter = true" 
                @mouseleave="isenter = false" :configs="{
                textColor: isenter ? '#517cff' : '#EB6864',
                content: node.content,
            }">
            </j-text>
            <j-text 
                @mouseenter="isenter = true" 
                @mouseleave="isenter = false" :configs="{
                textColor: isenter ? '#517cff' : '#EB6864',
                content: node.content,
            }">
            </j-text>
            <j-text 
                @mouseenter="isenter = true" 
                @mouseleave="isenter = false" :configs="{
                textColor: isenter ? '#517cff' : '#EB6864',
                content: node.content,
            }">
            </j-text>
        </j-group>
    </j-scroll-group>
</template>
<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    inject: ['renderJFlow'],
    props: {
        node: Object,
    },
    data() {
        return {
            toggle: false,
            isenter: false,
            innerConfig: {
                layout: new LinearLayout({
                    direction: 'vertical'
                }) 
            }
        }
    },
    computed: {
        configs() {
            return {
                borderRadius: 8,
                borderColor: '#EB6864',
                borderWidth: 2,
                maxWidth: 120,
                maxHeight: 32,
            }
        }
    },
    methods: {
        onClick(e) {
            e.detail.bubbles = false;
            this.toggle = !this.toggle;
        },
        onPressStart(e) {
            event.detail.bubbles = false;
            event.detail.preventDefault();
        }
    },
    mounted() {
        console.log('simpleNode mount')
    },
    updated() {
        this.renderJFlow();
    }
}
</script>