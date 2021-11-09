import { Group, Point, Text, Icon, LinearLayout } from '@joskii/jflow';
class Selector extends Group{
    constructor(configs = {}) {
        super({
            layout: new LinearLayout({
                direction: 'horizontal',
                gap: 0,
            }),
            borderColor: '#517cff',
            borderWidth: 2,
            borderRadius: 5,
            width: configs.width || 200,
            hoverStyle: 'transparent',
            hasShrink: false,
            lock: true,
            data: {
                instances: [
                    new Text({
                        font: '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
                        textColor: '#585c63',
                        content: '请选择接口',
                        lineHeight: 26,
                        indent: 10,
                    }),
                ],
                links: []
            }
        })
    }
}
export default Selector;