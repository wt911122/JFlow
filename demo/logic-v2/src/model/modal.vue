<template>
    <transition name="fade">
    <div :class="$style.wrapper" v-show="meta.active">
        <div :class="$style.root" v-if="target">
            <div :class="$style.header">
                <div>{{ target.concept }}</div>
                <button @click="onClose">close</button>
            </div>
            <div :class="$style.content">
                <textarea :class="$style.box" :value="target.content" 
                    @blur="onChangeContent">
                </textarea>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
export default {
    inject: ['renderJFlow'],
    props: {
        meta: Object
    },
    computed: {
        target() {
            return this.meta.target || {}
        }
    },
    methods: {
        onClose() {
            Object.assign(this.meta, {
                active: false,
            })
        },
        onChangeContent(event) {
            const c = event.target.value;
            this.target.content = c;
            this.renderJFlow();
        }
    }
}
</script>

<style module>
.wrapper{
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
}

.root {
    width: 500px;
    height: 375px;
    background: #fff;
}
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}
.content{
    padding: 10px;
}
.box {
    width: 100%;
    height: 300px;
    overflow: scroll;
}
</style>