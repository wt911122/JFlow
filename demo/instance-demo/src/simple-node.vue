<template>
    <!-- jflowId 就是 layoutNode 中 ID -->
    <j-group 
        :source="node"
        @click="onClick" 
        @instancePressStart="onPressStart"
        :configs="configs">
        <j-text :configs="{
            textColor: '#EB6864',
            content: node.name,
        }">
        </j-text>
    </j-group>
</template>
<script>

export default {
    props: {
        node: Object,
    },
    data() {
        return {
            toggle: false,
        }
    },
    computed: {
        configs() {
            return {
                borderRadius: 8,
                borderColor: '#EB6864',
                borderWidth: 2,
                padding: this.toggle ? 10 : 20,
            }
        }
    },
    methods: {
        onClick() {
            this.toggle = !this.toggle;
        },
        onPressStart(e) {
            event.detail.bubbles = false;
            event.detail.preventDefault();
        }
    },
    mounted() {
        console.log('simpleNode mount')
    }
}
</script>