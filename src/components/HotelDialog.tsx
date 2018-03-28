import * as React from 'react';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
  } from 'material-ui/Dialog';
import Button from 'material-ui/Button';

// import Typography from 'material-ui/Typography';

interface Props {
    isOpen: boolean;
    hotel: google.maps.places.PlaceResult;
    onRequestClose: () => void;
}

const HotelDialog: React.SFC<Props> = (props) => {
    const h = props.hotel;

    let photoUrl = '/images/banner-hotel.jpg';
    if (h.photos !== undefined) {
        photoUrl = h.photos[0].getUrl({maxHeight: 200});
    }

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onRequestClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        > 
            <div 
                style={{
                    backgroundImage: `url(${photoUrl})`, 
                    backgroundSize: 'cover', 
                    width: 600, 
                    height: 200, 
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: '50% 50%'
                }} 
            />
            <DialogTitle id="alert-dialog-title">{h.name}</DialogTitle>
            <DialogContent>
                <table style={{border: '0px solid transparent'}}>
                    <tbody>
                        <tr>
                            <td style={{fontWeight: 'bold'}}>Prijs:</td>
                        </tr>
                        <tr>
                            <td style={{fontWeight: 'bold'}}>Adres:</td>
                            {/* <td>{f.address}</td> */}
                        </tr>
                        <tr>
                            <td style={{fontWeight: 'bold', paddingRight: 20}}>Wanneer:</td>
                            {/* <td>{f.startDate.toLocaleString()}</td> */}
                        </tr>
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { console.log('test'); }}>Doe iets</Button>
            </DialogActions>
        </Dialog>
    );
};

export default HotelDialog;