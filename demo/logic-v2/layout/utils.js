export const layoutConstance = {
    rowGap : 50,
    columnGap : 75,
    columnWidth : 189,
    rowHeight : 32,
    minSpanX: 163,
    minSpanY: 50,
    minGapY: 30
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
