<template>
<transition name="fade">
  <div :class="$style.root" v-show="meta.active" :style="translateStyle">
      {{ meta.target.content }}
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
            return `transform: translate(${this.meta.clientX}px, ${this.meta.clientY - 46}px)`
        }
    }
}
</script>

<style module>
.root{
     background: #22242E;
    color: #fff;
    padding: 10px 12px;
    position: absolute;
    /* transform: translate(-50%, -100%); */
    font-size: 14px;
    left: 0;
    top: 0;
    transform: translate(0, 0);
}
.root::after {
     display: block;
    content: ' ';
    width: 8px;
    height: 8px;
    position: absolute;
    bottom: 0px;
    left: 50%;
    background: #000;
    transform: translate(-3px, 3px) rotate(45deg);
}
</style>