<template>
    <j-logic-node-group  
        :source="node" 
        :configs="configs">
        <j-group :configs="iconGroup">
            <j-icon :configs="imageConfig" />
        </j-group>
    </j-logic-node-group >
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import logicIcon from './assets/start.png';
const p = new Image();
p.src = logicIcon;
export default {
    props: {
        node: Object,
    },
    data() {
        return {
            configs: {
                layout: new LinearLayout({
                    direction: 'vertical',
                    gap: 10,
                }),
            },
            iconGroup: {
                padding: 10,
                backgroundColor: '#fff',
                borderColor: '#E0E0E0',
                borderWidth: 1,
            },
            imageConfig: {
                image: p,
                width: 20,
                height: 20,
            }
        }
    },
}
</script>

<style>

</style>