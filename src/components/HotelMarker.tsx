import * as React from 'react';
import { Marker } from 'react-google-maps';
import HotelDialog from './HotelDialog';

interface Props {
    hotel: google.maps.places.PlaceResult;
}
interface State {
    popoutOpen: boolean;
}

export default class HotelMarker extends React.Component<Props, State> {
    state = {
        popoutOpen: false
    };

    handleClick = () => {
        this.setState({popoutOpen: !this.state.popoutOpen});
    }

    public render() {
        const h = this.props.hotel;

        return (
            <div>
                <Marker 
                    onClick={this.handleClick}
                    position={h.geometry.location}
                    icon={{url: '/images/hotel.png'}}
                />
                <HotelDialog 
                    isOpen={this.state.popoutOpen}
                    hotel={h}
                    onRequestClose={this.handleClick}
                />
            </div>
        );
    }
}