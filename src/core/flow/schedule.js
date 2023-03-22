const FPS = 60;
const rate = ~~1000/FPS;
export default {
    initSchedule() {
        this.__clock__ = Date.now() - rate;
        this.__callbacks__ = [];
    },
    scheduleRender(callback) {
        if(callback) {
            this.__callbacks__.push(callback);
        }
        if(!this.__processing__ &&  Date.now() - this.__clock__ >= rate) {
            this.__processing__ = true;
            requestAnimationFrame((timestamp) => {
                this.__render();
                this.__callbacks__.forEach(cb => {
                    cb(timestamp);
                });
                this.__callbacks__ = [];
                // if(callback) {
                //     callback(timestamp);
                // }
                this.__processing__ = false;
                this.__clock__ = timestamp;
            })
        }
        
    }
}