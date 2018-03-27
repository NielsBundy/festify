export default class Location {
    public latitude: number;
    public longitude: number;

    constructor(data?: Location) {
        Object.assign(this, data);
    }
}