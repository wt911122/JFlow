<template>
  <j-group :configs="configs">
      <j-icon :configs="imageConfig" />
      <j-text :configs="{
            font: '16px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
            textColor: '#585c63',
            content: '调用逻辑',
    }" />
  </j-group>
</template>

<script>
import { LinearLayout } from '@joskii/jflow';
import logicIcon from '../assets/logic.svg';
const p = new Image();
p.src = logicIcon;
export default {
    data() {
        return {
            configs: {
                layout: new LinearLayout({
                    direction: 'horizontal',
                    gap: 0
                }),
                borderRadius: 10,
                borderColor: '#ccc',
                hoverStyle: '#517cff',
                borderWidth: 0,
                lock: true,
            },
            imageConfig: {
                image: p,
                width: 30,
                height: 30,
            }
        }
    }
}
</script>

<style>

</style>