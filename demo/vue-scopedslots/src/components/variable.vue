<template>
     <j-diamond-group 
        :jflowId="node.id" 
        :configs="groupConfig"
        v-on="$listeners">
        <j-text :configs="{
            fontSize: '12px',
            textColor: '#585c63',
            content: node.content,
            lineHeight: 26,
            editable: true
        }"
        @change="onContentChange"/>
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
                borderWidth: 2,
                borderRadius: 5,
                padding: 10,
            }
        }
    },
    methods: {
        onContentChange(event){
            console.log(event.detail)
            this.$emit('change', {
                val: event.detail.val,
                oldVal: event.detail.oldVal,
            });
        }
    }
}
</script>

<style>

</style>