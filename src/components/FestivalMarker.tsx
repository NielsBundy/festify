import * as React from 'react';
import Festival from '../models/Festival';
import { Marker } from 'react-google-maps';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
  } from 'material-ui/Dialog';

import Button from 'material-ui/Button';

interface Props {
    festival: Festival;
    requestFindHotels: (location: any, radius: number) => void;
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

    handleClickTicketMaster = () => {
        window.open(this.props.festival.ticketMasterUrl);
    }

    handleClickFindHotels = () => {
        this.setState(ps => { return { popoutOpen: !ps.popoutOpen }; });
        this.props.requestFindHotels(this.props.festival.location, 50);
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
                        <table style={{border: '0px solid transparent'}}>
                            <tbody>
                                <tr>
                                    <td style={{fontWeight: 'bold'}}>Prijs:</td>
                                    <td>{f.ticketPrice} EUR</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight: 'bold'}}>Adres:</td>
                                    <td>{f.address}</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight: 'bold', paddingRight: 20}}>Wanneer:</td>
                                    <td>{f.startDate.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClickFindHotels}>
                            Vind hotels in de buurt
                        </Button>
                        <Button onClick={this.handleClickTicketMaster}>
                            Bekijk op TicketMaster
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
