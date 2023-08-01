import { requestCacheCanvas } from '../../utils/canvas';
export function calculateOffsetByWidth(
    offx, 
    textmeta,
    fontSize, fontFamily,
    spaceHolder
) {
    const content = textmeta.getRenderSource(spaceHolder);
    const maxL = content.length - 1;
    if(textmeta.width === 0) {
        return 0;
    }
    const allwidth = textmeta.width;
    let idx = Math.floor(offx / allwidth * maxL) ;
    requestCacheCanvas((ctx) => {
        ctx.font = `${fontSize} ${fontFamily}`;
        let g1, g2;
        let lastidx;

        let c = content.substring(0, idx);
        let c1 = content.substring(idx-1, idx);
        let c2 = content.substring(idx, idx+1);
        let w = ctx.measureText(c).width;
        let w1 = ctx.measureText(c1).width;
        let w2 = ctx.measureText(c2).width;
        g1 = w - w1/2;
        g2 = w + w2/2;
        
        do {
            if(g1 <= offx && g2 >= offx) {
                break;
            }  
            if(g1 > offx) {
                // 左侧少了
                const spanw = g2 - offx;
                lastidx = idx;
                if(spanw < 100) {
                    idx -= 1;
                } else {
                    idx -= Math.floor(spanw / g2 * lastidx)
                }
                c = content.substring(idx, lastidx);
                w -= ctx.measureText(c).width;
            } else if(g2 < offx) {
                // 右侧少了
                const spanw = offx - g1;
                lastidx = idx;
                if(spanw < 100) {
                    idx += 1;
                } else {
                    idx += Math.floor(spanw / (allwidth - g1) * (maxL - lastidx))
                }
                c = content.substring(lastidx, idx);
                w += ctx.measureText(c).width;
            }
            
            c1 = content.substring(idx-1, idx);
            c2 = content.substring(idx, idx+1);
            w1 = ctx.measureText(c1).width;
            w2 = ctx.measureText(c2).width;
            g1 = w - w1/2;
            g2 = w + w2/2;
        } while(idx >= 0 && idx <= maxL)
        
    });
    return idx;
}