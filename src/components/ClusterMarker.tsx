import * as React from 'react';
import { Marker } from 'react-google-maps';

interface Props {
    // tslint:disable-next-line: no-any
    position: any;
    points: number;
}

const ClusterMarker: React.SFC<Props> = (props) => {

    return (
        <Marker 
            position={props.position}
            icon={{url: '/images/cluster.png'}}
            label={{text: String(props.points)}}
        />
    );
};

export default ClusterMarker;