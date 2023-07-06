export default {
    initSchedule() {
        this.__clock__ = undefined;
    },
    scheduleRender(callback) {
        requestAnimationFrame((timestamp) => {
            const isFirstTime = this.__clock__ !== timestamp
            if(isFirstTime) {
                this.__render();
            }
            if(callback) {
                callback(timestamp);
            }
            this.__clock__ = timestamp;
        })
    }
}