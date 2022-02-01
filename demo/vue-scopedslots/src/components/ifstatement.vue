<template>
    <j-capsule-group
        :jflowId="node.id" 
        :configs="groupConfig"
        v-on="$listeners">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: 'ifstatement ' + node.id,
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
            }
        }
    },
}
</script>

<style>

</style>