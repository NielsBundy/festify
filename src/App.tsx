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
        setTimeout(() => this.setState({isLoading: false}), 2000);
    }

    render() {
        const markers = this.state.festivals.map((f: Festival, i: number) => <FestivalMarker key={i} festival={f} />);

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
