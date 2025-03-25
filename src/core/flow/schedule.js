

export default {
    toggleRender(val) {
        this.__renderstop__ = !val;
    },
    initSchedule() {
        this.__clock__ = undefined;
    },
    scheduleRender(callback) {
        requestAnimationFrame((timestamp) => {
            const isFirstTime = this.__clock__ !== timestamp
            if(!this.__renderstop__ && isFirstTime) {
                this.__render();
            }
            if(callback) {
                callback(timestamp);
            }
            this.__clock__ = timestamp;
        })
    }
}