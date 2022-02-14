<template>
    <j-rhombus-group
        :jflowId="node.id" 
        :configs="groupConfig"
        v-on="$listeners"
        @mouseenter="touch = true"
        @mouseleave="touch = false">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: 'ifstatement ' + node.id,
            lineHeight: 26,
            indent: 10,
        }"/>
    </j-rhombus-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        node: Object,
    },
    inject: ['renderJFlow'],
    data() {
        return {
            touch: false
        }
    },
    computed: {
        groupConfig() {
            return  {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                borderColor: '#517cff',
                backgroundColor: this.touch ? 'red' : '#fff',
                shadowColor: '#517cff',
                shadowBlur: 15,
                borderWidth: 2,
                borderRadius: 5,
                padding: 30,
            }
        }
    },
    watch: {
        touch(val) {

            console.log(val)
        }
    },
    updated() {
        this.renderJFlow();
    }
}
</script>

<style>

</style>