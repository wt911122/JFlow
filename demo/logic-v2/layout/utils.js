export const layoutConstance = {
    rowGap : 50,
    columnGap : 75,
    columnWidth : 189,
    rowHeight : 32,
    minSpanX: 163,
    minSpanY: 50,
    minGapY: 50
}

export function initLayoutConstance() {
    Object.keys(layoutConstance).forEach(k => {
        const value = localStorage.getItem(k);
        console.log(value)
        if(value !== null) {
            layoutConstance[k] = value;
        }
    })
    
}

export function setLayoutConstance(key, value) {
    layoutConstance[key] = value;
    localStorage.setItem(key, value);
}

export function getLayoutConstance(key) {
    return +layoutConstance[key];
}

export function setSourceInitialAnchor(jflowInstance, source, point) {
    const isSwitch = source.concept === 'Switch';
    if(isSwitch) {
        const i = jflowInstance.getRenderNodeBySource(source.cases[0])
        i.anchor = point;
    } else {
        const i = jflowInstance.getRenderNodeBySource(source);
        i.anchor = point;
    }
}

export function getSourceAnchor(jflowInstance, source) {
    const isSwitch = source.concept === 'Switch';
    if(isSwitch) {
        const case0 = source.cases[0];
        const i = jflowInstance.getRenderNodeBySource(case0);
        return i.anchor;
    } else {
        const i = jflowInstance.getRenderNodeBySource(source);
        return i.anchor;
    }
}
