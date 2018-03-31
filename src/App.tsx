import * as React from 'react';
import './App.css';

import GoogleMap, { netherlandsCoords } from './components/GoogleMap';
import SearchBar from './components/SearchBar';
import Festival from './models/Festival';
import FestivalParser from './FestivalParser';
import axios from 'axios';
import FestivalMarker from './components/FestivalMarker';
import HotelMarker from './components/HotelMarker';
import FestivalDialog from './components/FestivalDialog';
import { CircularProgress } from 'material-ui/Progress';
import 'typeface-roboto';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import Dialog, {
    DialogContent,
  } from 'material-ui/Dialog';

interface Props { }
interface State {
    isLoading: boolean;
    festivals: Festival[];
    filteredFestivals: Festival[];
    shownFestivals: Festival[];
    searchPlaceholder: string;
    filterMinPrice: number;
    filterMaxPrice: number;
    hotels: google.maps.places.PlaceResult[];
    mapCenter: any;
    mapZoom: number;
    isOnLandingPage: boolean;
    isShowingVideo: boolean;
}

const placeholders = [
    'Zoek op een genre...',
    'Zoek naar een artiest...',
    'Zoek naar een festival...',
    'Zoek op een plaats...'
];

class App extends React.Component<Props, State> {
    state = {
        festivals: [],
        filteredFestivals: [],
        shownFestivals: [],
        isLoading: true,
        mapCenter: netherlandsCoords,
        mapZoom: 8,
        clusters: [],
        searchPlaceholder: placeholders[Math.floor(Math.random() * placeholders.length)],
        filterMinPrice: 0,
        filterMaxPrice: 0,
        hotels: [],
        isOnLandingPage: true,
        isShowingVideo: false
    };

    componentWillMount() {
        // Laadt festivals in
        
        axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=CrAudt7Fecq4gmwSzIQMwpBoGndWzzIY&countryCode=nl&size=100`)
        .then(res => {
            const parser = new FestivalParser();
            const festivals = res.data._embedded.events.map(parser.parse);
            
            this.setFestivals(festivals);
        });
    }

    handleSearch = (query: string) => {
        this.setState({isLoading: true});

        axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=CrAudt7Fecq4gmwSzIQMwpBoGndWzzIY&countryCode=nl&size=100&keyword=${query}`)
        .then(res => {
            const parser = new FestivalParser();
            if (res.data._embedded === undefined) {
                alert('Er zijn geen resultaten voor dit trefwoord.');
                this.setState({isLoading: false});
                return;
            }
            const festivals = res.data._embedded.events.map(parser.parse);
            
            this.setFestivals(festivals);
        });
    }

    setFestivals = (festivals: Festival[]) => {
        const minPrice = festivals.reduce((minF: Festival, cF: Festival) => cF.ticketPrice < minF.ticketPrice ? cF : minF, festivals[0]).ticketPrice;
        const maxPrice = festivals.reduce((maxF: Festival, cF: Festival) => cF.ticketPrice > maxF.ticketPrice ? cF : maxF, festivals[0]).ticketPrice;

        this.setState({festivals, filteredFestivals: festivals, isLoading: false, filterMinPrice: minPrice, filterMaxPrice: maxPrice});
    }

    setFilterFestivals = (filter: (f: Festival) => boolean) => {
        const festivals = this.state.festivals.filter(filter);
        
        // const minPrice = festivals.reduce((minF: Festival, cF: Festival) => cF.ticketPrice < minF.ticketPrice ? cF : minF, festivals[0]).ticketPrice;
        // const maxPrice = festivals.reduce((maxF: Festival, cF: Festival) => cF.ticketPrice > maxF.ticketPrice ? cF : maxF, festivals[0]).ticketPrice;

        this.setState({filteredFestivals: festivals/*, filterMinPrice: minPrice, filterMaxPrice: maxPrice */});
    }

    handleRequestFindHotels = (location: any, radius: number, currentZoom: number) => {
        this.setState({isLoading: true});
        const service = new google.maps.places.PlacesService(document.createElement('div'));

        service.nearbySearch(
        {
            location: new google.maps.LatLng(location.latitude, location.longitude),
            radius: radius,
            type: 'hotel',
            name: 'hotel'
        },
        results => {
            const places = results as google.maps.places.PlaceResult[];

            this.setState({isLoading: false, hotels: places, mapCenter: {lat: Number(location.latitude), lng: Number(location.longitude)}, mapZoom: currentZoom});
        });
    }

    handleClusterClick = (cluster: Cluster) => {
        const markers = cluster.getMarkers();
        let areAllDuplicates = true;
        for (var i = 0; i < markers.length; i++) {
            const marker1 = markers[i];
            const location1 = marker1.getPosition();

            for (var x = 0; x < markers.length; x++) {
                if (i === x) {
                    continue;
                }
                const marker2 = markers[x];
                const location2 = marker2.getPosition();

                if (location1.lat() !== location2.lat() &&
                    location1.lng() !== location2.lng()) {
                        areAllDuplicates = false;
                        break;
                    }
            }
            if (areAllDuplicates) {
                break;
            }
        }

        if (areAllDuplicates) {
            // Al deze markers vinden op deze plaats plek
            const position = markers[0].getPosition();
            const festivals = this.getFestivalsByPosition(position);
            if (festivals === undefined) { return; }

            this.setState({shownFestivals: festivals});
        }
    }

    getFestivalsByPosition = (position: google.maps.LatLng): Festival[] | undefined => {
        return this.state.filteredFestivals.filter((f: Festival) => {
            return Math.abs(f.location.latitude - position.lat()) < 0.00001 &&
                   Math.abs(f.location.longitude - position.lng()) < 0.00001;
        }) as Festival[];
    }

    render() {
        const markers = this.state.filteredFestivals.map((f: Festival, i: number) => <FestivalMarker key={i} festival={f} requestFindHotels={this.handleRequestFindHotels} />);
        const hotelMarkers = this.state.hotels.map((h: google.maps.places.PlaceResult, i: number) => <HotelMarker key={i} hotel={h} />);
        if (this.state.isOnLandingPage) {
            return (
                <div className="space">
                    <div className="header" style={{padding: 24}}>
                        <Grid container spacing={24}>
                            <Grid item xs sm={3}>
                                <div className="logo">
                                .
                                </div>
                            </Grid>
                            <Grid item xs>
                                .
                            </Grid>
                            <Grid item xs>
                                .
                            </Grid>
                            <Grid item xs>
                                .
                            </Grid>
                            <Grid item xs>
                                <div className="buttontje">
                                <Button variant="raised" color="secondary"  size="large" onClick={() => this.setState({isShowingVideo: true})}>
                                    Hoe werkt het?
                                </Button>
                                </div>
                            </Grid>
                            <Grid item xs>
                            <div className="buttontje">
                                <Button variant="raised" color="secondary"  size="large" onClick={() => this.setState({isOnLandingPage: false})}>
                                    Begin
                                </Button>
                            </div>
                            </Grid>
                        </Grid>
                    </div>
                    <Dialog 
                        maxWidth={false}
                        open={this.state.isShowingVideo}
                        onClose={() => this.setState({isShowingVideo: false})}
                    >
                        <DialogContent style={{padding: 0}}>
                        <iframe 
                            style={{width: 1024, height: 600}}
                            src="https://www.youtube.com/embed/px0zyeeGNYU?rel=0&amp;controls=0&amp;showinfo=0" 
                        />
                        </DialogContent>
                    </Dialog>
                </div>
            );
        }

        return (
            <div className="App">
                <SearchBar 
                    style={{position: 'absolute', zIndex: 2, margin: 10}}
                    placeholder={this.state.searchPlaceholder}
                    onSearch={this.handleSearch}
                    minPrice={this.state.filterMinPrice}
                    maxPrice={this.state.filterMaxPrice}
                    onRequestApplyFilter={this.setFilterFestivals}
                />
                <GoogleMap 
                    clusteredMarkers={markers}
                    markers={hotelMarkers}
                    zoom={this.state.mapZoom}
                    center={this.state.mapCenter}
                    onClusterClick={this.handleClusterClick}
                />
                <Dialog open={this.state.isLoading}>
                    <DialogContent>
                        <CircularProgress />
                    </DialogContent>
                </Dialog>
                <FestivalDialog 
                    requestFindHotels={this.handleRequestFindHotels}
                    isOpen={this.state.shownFestivals.length !== 0}
                    onRequestClose={() => this.setState({shownFestivals: []})}
                    festivals={this.state.shownFestivals}
                />
            </div>
        );
    }
}

export default App;
