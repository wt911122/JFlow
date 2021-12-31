<template>
    <j-point 
        :name="node.name" 
        :configs="{
            color: '#fff',
            borderColor: '#000',
            borderWidth: 1,
            radius: 5,
            ignoreHit: true,
        }">
    </j-point>
</template>

<script>
export default {
    props: {
        node: Object,
    }
}
</script>

<style>

</style>