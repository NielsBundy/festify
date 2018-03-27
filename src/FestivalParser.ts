import Festival from './models/Festival';
import Location from './models/Location';

export default class FestivalParser {
    // tslint:disable-next-line: no-any
    public parse(data: any): Festival {
        const venue = data._embedded.venues[0];
        let address =
            venue.postalCode 
            + ', ' + 
            venue.city.name;
        if (venue.name !== undefined) {
            address = venue.name + ', ' + address;
        }

        return new Festival({
            name: data.name,
            url: data.url,
            location: new Location({
                latitude: venue.location.latitude,
                longitude: venue.location.longitude
            }),
            imageUrl: data.images[0].url,
            address,
            startDate: new Date(data.sales.public.startDateTime),
            endDate: new Date(data.sales.public.endDateTime),
            ticketPrice: data.priceRanges !== undefined ? data.priceRanges[0].min : 0,
            ticketMasterUrl: data.url
        });
    }
}