import * as React from 'react';
import Festival from '../models/Festival';
import { Marker } from 'react-google-maps';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';

interface Props {
    festival: Festival;
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

    public render() {
        const f = this.props.festival;

        return (
            <div>
                <Marker 
                    onClick={this.handleClick}
                    position={{lat: Number(f.location.latitude), lng: Number(f.location.longitude)}}
                />
                <Dialog
                    open={this.state.popoutOpen}
                    onClose={this.handleClick}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                > 
                    <div 
                        style={{
                            backgroundImage: `url(${f.imageUrl})`, 
                            backgroundSize: 'cover', 
                            width: 600, 
                            height: 200, 
                            backgroundRepeat: 'no-repeat', 
                            backgroundPosition: '50% 50%'
                        }} 
                    />
                    <DialogTitle id="alert-dialog-title">{f.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <p>Prijs: {f.ticketPrice} EUR</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        t
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
