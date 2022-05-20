<template>
    <j-logic-link
        :configs="configs"
        :from="linkConfigs.from.source"
        :to="linkConfigs.to.source"
        @instancemousemove="setPointerCursor"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="onClick"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragOverEnd"
        @drop="onDropToLink">
    </j-logic-link>
</template>

<script>
import { translateToClientCoord } from '../custom/utils';
export default {
    inject: ['renderJFlow', 'poppups'],
    props: {
        linkConfigs: Object,
    },
    data() {
        return {
            isDragOver: false,
            showAdd: false,
            showDragover: false,
        };
    },
    computed: {
        configs() {
            // console.log(this.linkConfigs.bendPoint)
            return {
                ...this.linkConfigs,
                // fromDir: undefined,
                // toDir: undefined,
                // isSelf: false,
                // noArrow: this.linkConfigs.to.type === 'endpoint',
                showAdd: this.showAdd,
                showDragover: this.isDragOver,
                radius: 5,
                approximate: 36,
                backgroundColor: '#919499',
            };
        },
        selectionMeta() {
            return this.poppups.selectionMeta;
        },
        selectionActive() {
            return this.selectionMeta.active && this.selectionMeta.target === this.linkConfigs;
        },
    },
    watch: {
        selectionActive(val) {
            if(!val) {
                this.showAdd = false;
            }
        }
    },
    updated() {
        this.renderJFlow();
    },
    methods: {
        setPointerCursor($event) {
            $event.detail.jflow.canvas.style.cursor = 'pointer';
            $event.detail.bubbles = false;
        },
        // getTargetConcept($event) {
        //     const node = $event.detail.target;
        //     const source = this.getMovingSource();
        //     return source?.concept || node?.concept;
        // },
        onDropToLink($event) {
            this.$emit('drop', $event);
            this.isDragOver = false;
        },
        onDragEnter($event) {
            // const concept = this.getTargetConcept($event);
            // if (LINK_ACCEPT_CONCEPT.includes(concept)) {
                this.isDragOver = true;
            // }
        },
        onDragOver($event) {
            // $event.detail.jflow.canvas.style.cursor = 'default';
            // const node = $event.detail.target;
            // if (LINK_ACCEPT_CONCEPT.includes(node?.concept)) {
            
            const e = $event.detail.originEvent;
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy';
            }

            // }
        },
        onDragOverEnd() {
            this.isDragOver = false;
            // this.setCanvasCursor('default');
            // if ($event.detail.target?.groupType === 'Rules') {
            //     $event.detail.event.dataTransfer.dropEffect = 'none';
            // }
        },
        onMouseEnter() {
            this.showAdd = true;
        },
        onMouseLeave() {
            if(!this.selectionActive) {
                this.showAdd = false;
            }
        },
        onClick(event) {
            console.log(event)
            event.detail.bubbles = false;
            const { clientX, clientY } = event.detail.event;
            // const [x, y] = translateToClientCoord(currentTarget);
            this.showAdd = true;
            Object.assign(this.selectionMeta, {
                type: 'addMenu',
                clientX,
                clientY,
                active: true,
                target: this.linkConfigs,
            });
        }
    }
}
</script>

<style>

</style>