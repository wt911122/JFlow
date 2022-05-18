<template>
<j-logic-node-group
    :source="node">
    <j-point
        :configs="{
            backgroundColor: '#666E80',
            borderWidth: 1,
            radius: 2,
            ignoreHit: true,
        }">
    </j-point>
</j-logic-node-group>
</template>

<script>
export default {
    props: {
        node: Object,
    },
    created() {
        console.log(this.node)
    }
};
</script>

<style>

</style>
