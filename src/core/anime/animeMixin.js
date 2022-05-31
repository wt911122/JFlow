
export default {
    initAnime() {
        this.anime_queue = [];
        this.animeclock = undefined;
        this.frameRendered = false;
    },
    setAnimeClock(time) {
        if(time !== this.animeclock) {
            this.frameRendered = false;
            this.animeclock = time;
        }
    },

    requestJFlowAnime(frameCallBack) {
        const meta = this.enqueueAnime(frameCallBack);
        this.runAnime();
        return meta;
    },

    enqueueAnime(callback) {
        const animeMeta = {
            start: undefined,
            callback,
            cancel: () => {
                this._cancelAnime(animeMeta);
                requestAnimationFrame((timestamp) => {
                    this.setAnimeClock(timestamp);
                    this._render();
                })
            }
        }
        this.anime_queue.push(animeMeta);
        return animeMeta;
    },

    _cancelAnime(meta) {
        const idx = this.anime_queue.findIndex(m => m === meta);
        ~idx && this.anime_queue.splice(idx, 1);
        
    },

    runAnime() {
        requestAnimationFrame(this._runAnime.bind(this));
    },
    _runAnime(timestamp) {
        if (this.anime_queue.length) {
            this.setAnimeClock(timestamp);
            // this.setAnimeClock(timestamp);
            this._render();
            requestAnimationFrame(this._runAnime.bind(this))
        }
    },

    runAnimeFrame() {
        this.anime_queue.forEach(meta => {
            const timestamp = Date.now();
            if(!meta.start) {
                meta.start = timestamp;
            }
            const elapsed = timestamp - meta.start;
            meta.callback(elapsed);
        });
    }
}