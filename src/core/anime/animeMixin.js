
export default {
    initAnime() {
        this.anime_queue = [];
    },

    requestJFlowAnime(frameCallBack) {
        console.log('requestJFlowAnime');
        const meta = this.enqueueAnime(frameCallBack);
        this.runAnime();
        return meta;
    },

    enqueueAnime(callback) {
        const animeMeta = {
            start: undefined,
            callback,
            cancel: () => {
                console.log('_cancelAnime');
                this._cancelAnime(animeMeta)
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
            console.log('_runAnime', this.anime_queue.length)
            this.anime_queue.forEach(meta => {
                if(!meta.start) {
                    meta.start = timestamp;
                }
                const elapsed = timestamp - meta.start;
                meta.callback(elapsed);
            });
            this._render();
            requestAnimationFrame(this._runAnime.bind(this))
        }
    }
}