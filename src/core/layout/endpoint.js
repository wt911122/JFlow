import Point from '../instance/point';
class EndPoint extends Point{
    constructor(configs){
        super(configs);
        this.color = 'white';
        this.strokeColor = 'black';
        this.borderWidth = 1;
        this.radius = 10;
        this.ignoreHit = true;
    }
}

export default EndPoint;