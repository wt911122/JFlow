
export default {
    initAnime() {
        this.anime_queue = [];
        this.__animeClock__ = undefined;
        // this.animeclock = undefined;
        // this.frameRendered = false;
    },
    // setAnimeClock(time) {
    //     if(time !== this.animeclock) {
    //         this.frameRendered = false;
    //         this.animeclock = time;
    //     }
    // },

    // hasAnimeAndFrameRendered() {
    //     return this.anime_queue.length && this.frameRendered;
    // },

    // setFrameRendered() {
    //     if(this.anime_queue.length) {
    //         this.frameRendered = true;
    //     }
    // },

    requestJFlowAnime(frameCallBack) {
        const meta = this.enqueueAnime(frameCallBack);
        this._runAnime();
        return meta;
    },

    enqueueAnime(callback) {
        const animeMeta = {
            start: undefined,
            callback,
            cancel: () => {
                this._cancelAnime(animeMeta);
                this._render();
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
        this._runAnime();
        // requestAnimationFrame(this._runAnime.bind(this));
    },
    _runAnime() {
        if (this.anime_queue.length) {
            this.scheduleRender((t) => {
                if(this.__animeClock__  !== t) {
                    this._runAnime()
                }
                this.__animeClock__  = t;
            });
            // requestAnimationFrame(this._runAnime.bind(this))
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