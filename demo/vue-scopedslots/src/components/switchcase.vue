<template>
    <j-diamond-group
        :source="node" 
        :configs="groupConfig"
        :rootLink="true"
        v-on="$listeners">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: node.content,
            lineHeight: 26,
        }"/>
    </j-diamond-group>
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
                paddingTop: 2,
                paddingBottom: 2,
                padding: 10,
                borderWidth: 2,
                borderRadius: 5,
            }
        }
    },
}
</script>

<style>

</style>