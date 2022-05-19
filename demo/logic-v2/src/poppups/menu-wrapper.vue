<template>
    <transition name="fade">
        <div v-show="meta.active" 
            :class="$style.root"
            :style="translateStyle">
            <slot></slot>
        </div>
    </transition>
</template>

<script>

export default {
    props: {
        meta: Object,
    },
    computed: {
        translateStyle() {
            console.log(this.meta)
            return `transform: translate(${this.meta.clientX}px, ${this.meta.clientY}px)`
        }
    }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<style module>
.root {
    position: absolute;
    width: 208px;
    left: 0;
    top: 0;
    transform: translate(0, 0);
}
</style>