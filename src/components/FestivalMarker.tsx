import * as React from 'react';
import Festival from '../models/Festival';
import { Marker } from 'react-google-maps';

import FestivalDialog from './FestivalDialog';

interface Props {
    festival: Festival;
    requestFindHotels: (location: any, radius: number, currentZoom: number) => void;
}
interface State {
    popoutOpen: boolean;
}

export default class FestivalMarker extends React.Component<Props, State> {
    state = {
        popoutOpen: false
    };

    handleClick = () => {
        this.setState(ps => { return { popoutOpen: !ps.popoutOpen }; });
    }

    handleRequestClose = () => {
        this.handleClick();
    }

    public render() {
        const f = this.props.festival;

        return (
            <div>
                <Marker 
                    onClick={this.handleClick}
                    position={{lat: Number(f.location.latitude), lng: Number(f.location.longitude)}}
                />
                <FestivalDialog
                    festivals={[this.props.festival]}
                    onRequestClose={this.handleRequestClose}
                    isOpen={this.state.popoutOpen}
                    requestFindHotels={this.props.requestFindHotels}
                />
            </div>
        );
    }
}
