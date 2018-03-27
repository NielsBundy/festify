import * as React from 'react';
import './App.css';

import GoogleMap, { netherlandsCoords } from './components/GoogleMap';
import SearchBar from './components/SearchBar';
import Festival from './models/Festival';
import FestivalParser from './FestivalParser';
import axios from 'axios';
import FestivalMarker from './components/FestivalMarker';
import { CircularProgress } from 'material-ui/Progress';
import 'typeface-roboto';

import Dialog, {
    DialogContent,
  } from 'material-ui/Dialog';

interface Props { }
interface State {
    isLoading: boolean;
    festivals: Festival[];
}

class App extends React.Component<Props, State> {
    state = {
        festivals: [],
        isLoading: true,
        mapCenter: netherlandsCoords,
        mapZoom: 8,
        clusters: []
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
        let hasDuplicates = true;
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
                        hasDuplicates = false;
                        break;
                    }
            }
            if (hasDuplicates) {
                break;
            }
        }

        if (hasDuplicates) {
            // Al deze markers vinden op deze plaats plek
            alert('duplicates');
        }
    }

    render() {
        const markers = this.state.festivals.map((f: Festival, i: number) => <FestivalMarker key={i} festival={f} requestFindHotels={this.handleRequestFindHotels} />);

        return (
            <div className="App">
                <SearchBar 
                    style={{position: 'absolute', zIndex: 2, display: 'flex', margin: 10}}
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
            </div>
        );
    }
}

export default App;
