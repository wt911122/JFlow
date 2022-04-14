<template>
    <j-point
        :source="node"
        :configs="{
            backgroundColor: '#666E80',
            borderWidth: 1,
            radius: 2,
            ignoreHit: true,
        }">
    </j-point>
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
