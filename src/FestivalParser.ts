import Festival from './models/Festival';
import Location from './models/Location';

export default class FestivalParser {
    // tslint:disable-next-line: no-any
    public parse(data: any): Festival {
        return new Festival({
            name: data.name,
            url: data.url,
            location: new Location({
                latitude: data._embedded.venues[0].location.latitude,
                longitude: data._embedded.venues[0].location.longitude
            }),
            imageUrl: data.images[0].url,
            address: data._embedded.venues[0].name + ', ' + data._embedded.venues[0].postalCode + ', ' + data._embedded.venues[0].city.name,
            startDate: new Date(data.sales.public.startDateTime),
            endDate: new Date(data.sales.public.endDateTime),
            ticketPrice: data.priceRanges[0].min,
            ticketMasterUrl: data.url
        });
    }
}