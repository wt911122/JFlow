<template>
    <j-capsule-group
        :name="node.name" 
        :configs="groupConfig"
        v-on="$listeners">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: 'ifstatement' + node.name,
            lineHeight: 26,
            indent: 10,
        }"/>
    </j-capsule-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
export default {
    props: {
        node: Object,
        initialAnchor: Array,
    },
    computed: {
        groupConfig() {
            return  {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0,
                }),
                borderColor: '#517cff',
                shadowColor: '#517cff',
                shadowBlur: 15,
                borderWidth: 2,
                borderRadius: 5,
                hasShrink: false,
                lock: true,
                anchor: this.initialAnchor, 
            }
        }
    },
}
</script>

<style>

</style>