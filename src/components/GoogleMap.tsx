import * as React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { CircularProgress } from 'material-ui/Progress';

interface Props {
    // tslint:disable-next-line: no-any
    clusteredMarkers?: any[];
    markers?: any[];
    onClusterClick: (cluster: Cluster) => void;
    zoom: number;
    center: any;
}

export const netherlandsCoords = {lat: 52.15, lng: 5.3};
export const googleMapURL = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBuUBVvxTNR8tDpj5yIbqm1j3N6fCepr0U&libraries=places';

const Map: React.SFC<Props> = (props) => {

    const MyGoogleMap = withScriptjs(withGoogleMap(() => {
        return (
        <GoogleMap
            defaultCenter={props.center}
            defaultZoom={props.zoom}
            options={{disableDefaultUI: true}} 
        >
            <MarkerClusterer averageCenter={true} enableRetinaIcons={true} gridSize={60} onClick={props.onClusterClick}>
                {props.clusteredMarkers}
            </MarkerClusterer>
            {props.markers}
        </GoogleMap>);

    }));
    const loadingElement = <CircularProgress />;
    const containerElement = <div style={{height: '100vh'}}/>;
    const mapElement = <div style={{height: '100vh'}}/>;
    const map = (
                <MyGoogleMap
                    loadingElement={loadingElement}
                    containerElement={containerElement}
                    googleMapURL={googleMapURL}
                    mapElement={mapElement}
                />);

    return (
        <div style={{height: '100vh'}}>
            {map}
        </div>
    );
};

export default Map;