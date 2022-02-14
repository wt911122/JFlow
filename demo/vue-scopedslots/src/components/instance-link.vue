<template>
    <jPolyLink
        :configs="configs"
        :from="configs.from"
        :to="configs.to"
        @dragover="onDragOver"
        @dragoverend="onDragOverEnd"
        @drop="onDropToLink">
    </jPolyLink>
</template>

<script>
export default {
    props: {
        linkConfigs: Object,
    },
    data() {
        return {
            isDragOver: false,
        };
    },
    computed: {
        configs() {
            return {
                ...this.linkConfigs,
                // fromDir: undefined,
                // toDir: undefined,
                // isSelf: false,
                radius: 5,
                approximate: 400,
                backgroundColor: this.isDragOver ? 'rgba(81, 124, 255, 0.5)' : '#000',
            };
        },
    },
    methods: {
        onDropToLink($event) {
            this.$emit('drop', $event);
        },
        onDragOver($event) {
            this.isDragOver = true;
        },
        onDragOverEnd() {
            this.isDragOver = false;
        },
    },
};
</script>

<style>

</style>
