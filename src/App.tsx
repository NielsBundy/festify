import * as React from 'react';
import './App.css';

import GoogleMap, { netherlandsCoords } from './components/GoogleMap';
import SearchBar from './components/SearchBar';
import Festival from './models/Festival';
import FestivalParser from './FestivalParser';
import axios from 'axios';
import FestivalMarker from './components/FestivalMarker';
import FestivalDialog from './components/FestivalDialog';
import { CircularProgress } from 'material-ui/Progress';
import 'typeface-roboto';

import Dialog, {
    DialogContent,
  } from 'material-ui/Dialog';

interface Props { }
interface State {
    isLoading: boolean;
    festivals: Festival[];
    shownFestivals: Festival[];
    searchPlaceholder: string;
}

const placeholders = [
    'Zoek op een genre...',
    'Zoek op een artiest...',
    'Zoek op een festival...',
    'Zoek op een plaats...'
];

class App extends React.Component<Props, State> {
    state = {
        festivals: [],
        shownFestivals: [],
        isLoading: true,
        mapCenter: netherlandsCoords,
        mapZoom: 8,
        clusters: [],
        searchPlaceholder: placeholders[Math.floor(Math.random() * placeholders.length)]
    };

    componentWillMount() {
        // Laadt festivals in
        
        axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=CrAudt7Fecq4gmwSzIQMwpBoGndWzzIY&countryCode=nl&size=100`)
        .then(res => {
            const parser = new FestivalParser();
            const festivals = res.data._embedded.events.map(parser.parse);
            
            this.setState({festivals, isLoading: false});
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
            
            this.setState({festivals, isLoading: false});
        });
    }

    handleRequestFindHotels = (location: any, radius: number) => {
        const service = new google.maps.places.PlacesService(document.createElement('div'));

        service.nearbySearch(
        {
            location: new google.maps.LatLng(location.latitude, location.longitude),
            radius: radius,
            type: 'hotel',
            name: 'hotel'
        },
        results => {
            alert(results[0].name);
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
        return this.state.festivals.filter((f: Festival) => {
            return Math.abs(f.location.latitude - position.lat()) < 0.00001 &&
                   Math.abs(f.location.longitude - position.lng()) < 0.00001;
        }) as Festival[];
    }

    render() {
        const markers = this.state.festivals.map((f: Festival, i: number) => <FestivalMarker key={i} festival={f} requestFindHotels={this.handleRequestFindHotels} />);

        return (
            <div className="App">
                <SearchBar 
                    style={{position: 'absolute', zIndex: 2, display: 'flex', margin: 10}}
                    placeholder={this.state.searchPlaceholder}
                    onSearch={this.handleSearch}
                />
                <GoogleMap 
                    markers={markers}
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
