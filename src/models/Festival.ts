import Location from './Location';

export default class Festival {
    public name: string;
    public url: string;
    public location: Location;
    public address: string;
    public ticketPrice: number;
    public startDate: Date;
    public endDate: Date;
    public imageUrl: string;
    public ticketMasterUrl: string;

    constructor (data?: Festival) {
        Object.assign(this, data);
    }
}