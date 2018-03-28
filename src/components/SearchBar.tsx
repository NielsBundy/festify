import * as React from 'react';

import Card, { CardContent, CardActions } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import Festival from '../models/Festival';

interface Props {
    // tslint:disable-next-line: no-any
    style?: any;
    placeholder?: string;
    onSearch?: (query: string) => void;
    minPrice: number;
    maxPrice: number;
    onRequestApplyFilter: (filter: ((f: Festival) => boolean)) => void;
}
interface State {
    filterShown: boolean;
    value: string;
    minPrice: number;
    maxPrice: number;
    genre: string;
    place: string;
    canApplyFilter: boolean;
}

export default class SearchBar extends React.Component<Props, State> {

    state = {
        value: '',
        filterShown: false,
        minPrice: this.props.minPrice,
        maxPrice: this.props.maxPrice,
        canApplyFilter: false,
        genre: '',
        place: ''
    };

    componentWillReceiveProps(props: Props) {
        let newState = Object.assign({}, this.state);
        newState.canApplyFilter = false;

        if (props.minPrice !== this.state.minPrice) {
            newState.minPrice = props.minPrice;
        }
        if (props.maxPrice !== this.state.maxPrice) {
            newState.maxPrice = props.maxPrice;
        }

        this.setState(newState);
    }

    // tslint:disable-next-line: no-any
    handleChangeValue = (event: any) => {
        this.setState({value: event.target.value});
    }

    // tslint:disable-next-line: no-any
    handleKeyUp = (event: any) => {
        if (event.key !== 'Enter') {
            return;
        }

        this.performSearch();
    }

    handleClickFilter = (event: any) => {
        this.setState({filterShown: !this.state.filterShown});
    }

    performSearch = () => {
        if (this.props.onSearch !== undefined && this.state.value !== '') {
            this.props.onSearch(this.state.value);
        }
    }

    // handleKeyDownPriceInput = (event: any) => {
    //     if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
    //         event.preventDefault();
    //         return false;
    //     }
    //     return true;
    // }

    handleChangeMinPrice = (event: any) => {
        const newValue = Number(event.target.value);
        this.setState({minPrice: newValue, canApplyFilter: true});
    }

    handleBlurPrice = () => {
        if (this.state.minPrice > this.props.maxPrice) {
            this.setState({minPrice: this.props.maxPrice});
        } else if (this.state.minPrice < this.props.minPrice) {
            this.setState({minPrice: this.props.minPrice});
        } else if (this.state.minPrice > this.state.maxPrice && this.state.minPrice <= this.props.maxPrice && this.state.maxPrice >= this.props.minPrice) {
            this.setState({minPrice: this.state.maxPrice});
        } else if (this.state.maxPrice < this.props.minPrice) {
            this.setState({maxPrice: this.props.minPrice});
        } else if (this.state.maxPrice > this.props.maxPrice) {
            this.setState({maxPrice: this.props.maxPrice});
        } else if (this.state.maxPrice < this.state.minPrice && this.state.maxPrice >= this.props.minPrice && this.state.minPrice <= this.props.maxPrice) {
            this.setState({maxPrice: this.state.minPrice});
        }
    }

    handleChangeMaxPrice = (event: any) => {
        const newValue = Number(event.target.value);
        this.setState({maxPrice: newValue, canApplyFilter: true});
    }

    handleClickApplyFilter = () => {
        this.setState({canApplyFilter: false});

        const genre = this.state.genre.trim().toLowerCase();
        const place = this.state.place.trim().toLowerCase();

        this.props.onRequestApplyFilter((f: Festival) => {
            const priceOk = f.ticketPrice >= this.state.minPrice &&
                            f.ticketPrice <= this.state.maxPrice;
            const genreOk = genre === '' || f.name.toLowerCase().includes(genre);
            const placeOk = place === '' || f.address.toLowerCase().includes(place);

            return priceOk && genreOk && placeOk;
        });
    }

    handleChangeGenre = (event: any) => {
        this.setState({genre: event.target.value, canApplyFilter: true});
    }

    handleChangePlace = (event: any) => {
        this.setState({place: event.target.value, canApplyFilter: true});
    }

    public render() {
        return (
            <div style={this.props.style}>
                <Card style={{padding: 5, paddingLeft: 15, paddingRight: 10, paddingTop: 10}}>
                    <TextField 
                        label="Zoeken"
                        placeholder={this.props.placeholder}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="search"
                        value={this.state.value}
                        onChange={this.handleChangeValue}
                        onKeyUp={this.handleKeyUp}
                        style={{marginRight: 5, width: 250}}
                    />
                    <Tooltip title="Klik op te zoeken">
                        <IconButton onClick={this.performSearch}>
                            <Icon>search</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open/Sluit filter opties">
                        <IconButton onClick={this.handleClickFilter}>
                            <Icon>filter_list</Icon>
                        </IconButton>
                    </Tooltip>
                </Card>
                {this.state.filterShown &&
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="subheading" component="h2">Filter opties</Typography>
                        <Typography variant="caption" component="p">Prijs</Typography>
                        <Tooltip title="Gebruik de pijltjes toetsen (omhoog en omlaag) om de prijs aan te passen">
                            <div>
                            <FormControl style={{width: 100}}>
                                <Input 
                                    startAdornment={<InputAdornment position="start">&euro;</InputAdornment>} 
                                    type="number" 
                                    value={this.state.minPrice}
                                    onChange={this.handleChangeMinPrice}
                                    onBlur={this.handleBlurPrice}
                                /> 
                            </FormControl>
                            <Typography variant="caption" component="p" style={{display: 'inline-block', marginLeft: 10, marginRight: 10}}>tot</Typography>
                            <FormControl style={{width: 100}}>
                                <Input 
                                    startAdornment={<InputAdornment position="start">&euro;</InputAdornment>} 
                                    type="number" 
                                    value={this.state.maxPrice}
                                    onChange={this.handleChangeMaxPrice}
                                    onBlur={this.handleBlurPrice}
                                /> 
                            </FormControl>
                            </div>
                        </Tooltip>
                        <TextField label="Genre" fullWidth style={{margin: 5}} value={this.state.genre} onChange={this.handleChangeGenre} />
                        <TextField label="Plaats" fullWidth style={{margin: 5}} value={this.state.place} onChange={this.handleChangePlace} />
                    </CardContent>
                    <CardActions>
                        <Button variant="raised" disabled={!this.state.canApplyFilter} onClick={this.handleClickApplyFilter}>Pas toe</Button>
                    </CardActions>
                </Card>
                }
            </div>
        );
    }

}