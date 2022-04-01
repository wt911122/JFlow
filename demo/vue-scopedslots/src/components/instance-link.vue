<template>
    <jPolyLink
        :configs="configs"
        :from="linkConfigs.from.source"
        :to="linkConfigs.to.source"
        @dragenter="onDragEnter"
        @dragleave="onDragOverEnd"
        @drop="onDropToLink">
    </jPolyLink>
</template>

<script>
export default {
    inject: ['renderJFlow'],
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
            this.isDragOver = false;
        },
        onDragEnter($event) {
            console.log('dragenter')
            this.isDragOver = true;
        },
        onDragOverEnd() {
            console.log('onDragOverEnd')
            this.isDragOver = false;
        },
    },
    updated() {
        this.renderJFlow();
    }
};
</script>

<style>

</style>
