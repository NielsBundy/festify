import * as React from 'react';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
  } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Festival from '../models/Festival';

import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

interface Props {
    isOpen: boolean;
    festivals: Festival[];
    onRequestClose: () => void;
    requestFindHotels: (location: any, radius: number) => void;
}
interface State {
    index: number;
}

export default class FestivalDialog extends React.Component<Props, State> {
    state = {
        index: 0
    };

    handleClickTicketMaster = () => {
        window.open(this.props.festivals[this.state.index].ticketMasterUrl);
    }

    handleClickFindHotels = () => {
        this.props.onRequestClose();
        this.props.requestFindHotels(this.props.festivals[this.state.index].location, 500);
    }

    handleClickForward = () => {
        this.setState(ps => {
            return {
                index: ps.index + 1
            };
        });
    }

    handleClickBackward = () => {
        this.setState(ps => {
            return {
                index: ps.index - 1
            };
        });
    }

    requestClose = () => {
        this.setState({index: 0});
        this.props.onRequestClose();
    }

    public render() {
        if (this.props.festivals.length === 0) {
            return (
                <Dialog open={this.props.isOpen}>
                    <DialogTitle id="alert-dialog-title">Minstens een festival verwacht</DialogTitle>
                </Dialog>
            );
        }

        const f = this.props.festivals[this.state.index];
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={this.requestClose}
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
                                {f.ticketPrice > 0 ?
                                    <td>{f.ticketPrice} EUR</td>
                                    :
                                    <td>Gratis</td>
                                }
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
                    {this.props.festivals.length > 1 &&
                        <>
                            <IconButton onClick={this.handleClickBackward} disabled={this.state.index === 0}>
                                <i style={{backgroundImage: `url(/images/back.png)`, backgroundSize: '100%', display: 'inline-block', width: 30, height: 30}} />
                            </IconButton>
                            <Typography variant="caption">{this.state.index + 1} van de {this.props.festivals.length}</Typography>
                            <IconButton onClick={this.handleClickForward} disabled={this.state.index + 1 === this.props.festivals.length}>
                                <i style={{backgroundImage: `url(/images/forward.png)`, backgroundSize: '100%', display: 'inline-block', width: 30, height: 30}} />
                            </IconButton>
                        </>
                    }
                    <Button onClick={this.handleClickFindHotels}>
                        Vind hotels in de buurt
                    </Button>
                    <Button onClick={this.handleClickTicketMaster}>
                        Bekijk op TicketMaster
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}