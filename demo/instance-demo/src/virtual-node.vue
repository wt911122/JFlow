<template>
    <!-- jflowId 就是 layoutNode 中 ID -->
    <j-text-editor 
        :source="node"
        :configs="configs">
    </j-text-editor >
</template>
<script>
export default {
    props: {
        node: Object,
    },
    data() {
        console.log(this.node)
        return {
            configs: {
                content: this.node.content,
                borderWidth: 1,
                borderColor: '#ddd',
                textColor: '#000',
                lineHeight: 22,
                fontSize: '18px',
            }
        }
    },
}
</script>