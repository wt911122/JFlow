class Caret { 
    _row = 0;
    _column = [0,0];

    _status = {
        show: true,
        anime: null,
        lastElapsed: 0,
        refreshElapsed: false,
    }

    setRow(row) {
        this._row = row;
    }
    setColumn(columnoridx, column) {
        if(column !== undefined) {
            this._column[columnoridx] = column;
        } else {
            this._column = columnoridx;
        }
    }

    getRow() {
        return this._row;
    }

    getColumn(idx) {
        if(idx !== undefined) {
            return this._column[idx];
        }
        return this._column;
    }

    animate(jflow) {
        this._status.anime = jflow.requestJFlowAnime((elapsed) => {
            const lastElapsed = this._status.lastElapsed;
            if(this._status.refreshElapsed) {
                this._status.lastElapsed = elapsed;
                this._status.refreshElapsed = false;
            }
            if(elapsed - lastElapsed > 500) {
                this._status.show = !this._status.show;
                this._status.lastElapsed = elapsed;
            } 
        });
    }

    cancelAnimate() {
        this._status.anime.cancel()
        Object.assign(this._status, {
            show: true,
            anime: null,
            lastElapsed: 0,
        })
    }

    isShow() {
        return this._status.show;
    }

    refresh() {
        Object.assign(this._status, {
            show: true,
            refreshElapsed: true,
        });
    }

    toRange() {
        return [this._row, ...this._column];
    }

    fromRange(range) {
        this._row = range[0];
        this._column = range.slice(1);
    }
}

export default Caret;