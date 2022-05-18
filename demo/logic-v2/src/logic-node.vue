<template>
    <j-logic-node-group 
        :source="node" 
        :configs="configs">
        <j-group :configs="iconGroup">
            <j-icon :configs="imageConfig" />
        </j-group>

        <j-group :configs="textGroup">
            <j-text :configs="{
                fontSize: '12px',
                textColor: '#222',
                content: node.content,
                maxWidth: 159,
                ellipsis: true,
                textAlign: 'left'
            }">
            </j-text>
        </j-group>
    </j-logic-node-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import {
    ConceptColorMap,
    ConceptSubColorMap,
    ConceptIconMap,
} from './configs';

export default { 
    props: {
        node: Object,
    },
    data() {
        const node = this.node;
        const color = ConceptColorMap[node.concept];
        const subcolor = ConceptSubColorMap[node.concept]
        const icon = ConceptIconMap[node.concept];
        return {
            configs: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 10,
                }),
                borderWidth: 1,
                borderColor: color,
                backgroundColor: '#fff',
                borderRadius: 4,
                height: 32,
            },
            iconGroup: {
                padding: 8,
                backgroundColor: subcolor,
            },
            textGroup: {
                width: 159,
                paddingTop: 10,
                paddingBottom: 10,
            },
            imageConfig: {
                image: icon,
                width: 16,
                height: 16,
            }
        }
    },
}
</script>

<style>

</style>