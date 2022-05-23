import { BaseLink } from '@joskii/jflow';

import {
    DIRECTION,
    DIRECTION_ANGLE,
    polylinePoints,
    distToSegmentSquared,
    makeRadiusFromVector,
    isPolyLineIntersectionRectange,
    segmentDistances,
} from './utils';
const APPROXIMATE = 6;

function getInteratableSegment(points) {
    let i = 1;
    while (i < points.length) {
        if(points[i-1][1] - points[i][1]){
            return [points[i-1].slice(), points[i].slice()];
        }
        i++
    }
}
function samepoint(a, b) {
    return a[0] === b[0] && a[1] === b[1];
}

class LogicLink extends BaseLink {
     /**
     * 创建方形折线
     * @param {PolyLink~Configs} configs - 配置
     **/
    constructor(configs) {
        super(configs);
        /** @member {Number}   - 点击响应范围 */
        this.approximate   = configs.approximate || APPROXIMATE;
        /** @member {Number}   - 拐角弧度 */
        this.radius        = configs.radius || 0;
        /** @member {Number}   - 起点终点在 x 方向最小的跨度 */
        this.minSpanX      = configs.minSpanX || 10;
        /** @member {Number}   - 起点终点在 y 方向最小的跨度 */
        this.minSpanY      = configs.minSpanY || 10;
        /** @member {Number}    - 虚线数组 */
        this.lineDash      = configs.lineDash;
        /** @member {Number}    - 双向箭头 */
        this.doubleLink    = configs.doubleLink;
        /** @member {Number}    - 连线上的文字字体 */
        this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        /** @member {Number}    - 连线上的文字大小 */
        this.fontSize      = configs.fontSize || '12px';
        /** @member {Number}    - 连线上的文字 */
        this.content       = configs.content || '';
        this.noArrow       = !!configs.noArrow 
        this.bendPoint     = configs.bendPoint;
        this.iterateEndY   = configs.iterateEndY;
        this.minGapY       = configs.minGapY;
        this.showAdd       = false;
        this.showDragover  = false;

        this.arrowSegment = configs.arrowSegment;

        this.animePoint = configs.animePoint || {
            enable: false,
        }
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                if(k === 'animePoint') {
                    const enable = configs.animePoint.enable;
                    this.anime?.cancel();
                    if(enable) {
                        this.anime = this._jflow.requestJFlowAnime((elapsed) => {
                            this.animePoint.offset = (elapsed / 10) % this.animePoint.gap
                        })
                    }
                }
            }
        })
    }

    _calculateAnchorPoints() {
        const dmsfrom = this.from.getIntersectionsSeprate();
        const dmsto = this.to.getIntersectionsSeprate();
        const center = this.from.getCenter();
        const points = polylinePoints(
            dmsfrom[this.fromDir],
            dmsto[this.toDir],
            this.fromDir,
            this.toDir, 
            this.minSpanX || 100, 
            this.minSpanY || 55, 
            20, 
            this.minGapY || 15,
            this.bendPoint,
            center);
        this._cachePoints = points
        this._cacheAngle = [this.fromDir, this.toDir];
        this._cacheInteractableSegment = getInteratableSegment(points);
        if(this.iterateEndY) {
            this._cacheInteractableSegment[1][1] = Math.min(this.iterateEndY + center[1], this._cacheInteractableSegment[1][1])
        }

        this._cacheSegment = segmentDistances(points);
        
    }
    
    isInViewBox(br) {
        this._calculateAnchorPoints();
        return isPolyLineIntersectionRectange(this._cachePoints, br);
    }

    render(ctx) {
        // this._calculateAnchorPoints();
        const radius = this.radius;
        const points = this._cachePoints;
        const ItSegment = this._cacheInteractableSegment;
        const p = points[0];
        const pEnd = points[points.length - 1];
        const angleEnd = DIRECTION_ANGLE[this._cacheAngle[1]];
        
        ctx.fillStyle = ctx.strokeStyle = this.animePoint.enable ? this.animePoint.color : this.backgroundColor;
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        points.slice(1, points.length - 1).forEach((p, idx) => {
            if(this.radius) {
                const pLast = points[idx];
                const pNext = points[idx+2];
                const { p1, p2 } = makeRadiusFromVector(pLast, p, pNext, radius);
                if(p1 && p2){
                    ctx.lineTo(p1[0], p1[1]);
                    ctx.quadraticCurveTo(p[0], p[1], p2[0], p2[1]);
                } else {
                    ctx.lineTo(p[0], p[1]);
                }  
            } else {
                ctx.lineTo(p[0], p[1]);
            }
        });
        ctx.lineTo(pEnd[0], pEnd[1]);

        if(this.lineDash) {
            ctx.save();
            ctx.setLineDash(this.lineDash);
        }
        ctx.stroke();
        if(this.lineDash) {
            ctx.restore();
        }

        if(this.arrowSegment) {
            console.log(this.arrowSegment)
            ctx.save();
            let reducedArrowSegment = 0;
            let segid = 0;
            const segLenth = this._cacheSegment.length;
            console.log(this._cacheSegment)
            while (segid < segLenth) {
                const {
                    p1, p2,
                    dist,
                    reducedDist,
                } = this._cacheSegment[segid];
                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                
                while (reducedArrowSegment < reducedDist) {
                    if(reducedArrowSegment > 0) {
                        const r = 1 - (reducedDist - reducedArrowSegment) / dist;
                        let x, y, angle;
                        if(dx) {
                            x = p1[0] + r * dx;
                            y = p1[1];
                            angle = dx > 0 ? DIRECTION_ANGLE[DIRECTION.RIGHT] : DIRECTION_ANGLE[DIRECTION.LEFT];
                        } else if(dy) {
                            // 向下
                            x = p1[0];
                            y = p1[1]  + r * dy;
                            angle = dy > 0 ? DIRECTION_ANGLE[DIRECTION.BOTTOM] : DIRECTION_ANGLE[DIRECTION.TOP]
                        }
                        ctx.beginPath();
                        ctx.translate(x, y);
                        ctx.rotate(angle );
                        ctx.moveTo(-5, 0);
                        ctx.lineTo(0, -4);
                        ctx.lineTo(0, 4);
                        ctx.lineTo(-5, 0);
                        ctx.fill();
                        ctx.rotate(-angle);
                        ctx.translate(-x, -y);
                    }
                    reducedArrowSegment += this.arrowSegment;
                }
                segid ++;
            }
            
            ctx.restore();
        }

        if(this.animePoint.enable) {
            const animeGap = this.animePoint.gap;
            const animeOffset = this.animePoint.offset;
            let reducedArrowSegment = animeOffset;
            let segid = 0;
            const segLenth = this._cacheSegment.length;
            while (segid < segLenth) {
                const {
                    p1, p2,
                    dist,
                    reducedDist,
                } = this._cacheSegment[segid];
                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                
                while (reducedArrowSegment < reducedDist) {
                    if(reducedArrowSegment > 0) {
                        const r = 1 - (reducedDist - reducedArrowSegment) / dist;
                        let x, y, angle;
                        if(dx) {
                            x = p1[0] + r * dx;
                            y = p1[1];
                        } else if(dy) {
                            // 向下
                            x = p1[0];
                            y = p1[1]  + r * dy;
                        }
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    reducedArrowSegment += animeGap;
                }
                segid ++;
            }
        }

        if(this.showAdd){    
            ctx.beginPath();
            ctx.moveTo(ItSegment[0][0], ItSegment[0][1]);
            ctx.lineTo(ItSegment[1][0], ItSegment[1][1]);
            ctx.save();
            
            ctx.lineWidth = 2;
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#4C88FF';
            ctx.stroke();
            const x = ItSegment[0][0];
            const y = (ItSegment[1][1] - ItSegment[0][1])/2 + ItSegment[0][1]
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.moveTo(-4, -6);
            ctx.lineTo(4, -6);
            ctx.quadraticCurveTo(6, -6, 6, -4);
            ctx.lineTo(6, 4);
            ctx.quadraticCurveTo(6, 6, 4, 6);
            ctx.lineTo(-4, 6);
            ctx.quadraticCurveTo(-6, 6, -6, 4);
            ctx.lineTo(-6, -4);
            ctx.quadraticCurveTo(-6, -6, -4, -6);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(4, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(0, 4);
            ctx.stroke();
            ctx.translate(-x, -y);
            
            ctx.restore();
        }

        if(this.showDragover) {
            ctx.save()
            ctx.lineWidth = 2;
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#4C88FF';
            ctx.setLineDash([5, 5])
            const x = ItSegment[0][0];
            const y = (ItSegment[1][1] - ItSegment[0][1])/2 + ItSegment[0][1]
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.rect(-33, -5, 66, 10);
            ctx.fill();
            ctx.stroke();
            ctx.translate(-x, -y);
            ctx.restore()
        }

        if(!this.noArrow) {
            const atEnd = samepoint(ItSegment[1], points[points.length - 1])
            if(atEnd && this.showAdd) {
                ctx.save();
                ctx.fillStyle = ctx.strokeStyle = '#4C88FF';
            }
            ctx.beginPath();
            ctx.translate(pEnd[0], pEnd[1]);
            ctx.rotate(angleEnd);
            ctx.moveTo(0, 0);
            ctx.lineTo(-5, -4);
            ctx.lineTo(-5, 4);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.rotate(-angleEnd);
            ctx.translate(-pEnd[0], -pEnd[1]);
            if(atEnd) {
                ctx.restore();
            }
        }
        if(this.content) {
            ctx.beginPath();
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            switch (this.fromDir) {
                case DIRECTION.BOTTOM:
                    ctx.textAlign = 'left';
                    ctx.fillText(this.content, p[0] + 2, p[1] + 10);
                    break;
                case DIRECTION.RIGHT:
                    ctx.textAlign = 'left';
                    ctx.fillText(this.content, p[0] + 10, p[1] - 2);
                    break;
                default:
                    break;
            }
        }

    }

    isHit(point) {
        const points = this._cacheInteractableSegment;
        const dist = distToSegmentSquared(point, points[0], points[1]);
        if(dist < this.approximate){
            return true;
        }
        return false
    }
}

export default LogicLink;