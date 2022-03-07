export default {
    canvas: {
        wheel (event, jflow) {
            event.preventDefault();
            let { offsetX, offsetY, deltaX, deltaY } = event 
            if(event.ctrlKey) { 
                deltaY = -deltaY;
            }
            jflow.zoomHandler(offsetX, offsetY, deltaX, deltaY, event);
        },
    }
}