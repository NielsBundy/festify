import * as React from 'react';

import Card, { CardContent, CardActions } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';

interface Props {
    // tslint:disable-next-line: no-any
    style?: any;
    placeholder?: string;
    onSearch?: (query: string) => void;
    minPrice: number;
    maxPrice: number;
}
interface State {
    filterShown: boolean;
    value: string;
    minPrice: number;
    maxPrice: number;
    canApplyFilter: boolean;
}

export default class SearchBar extends React.Component<Props, State> {

    state = {
        value: '',
        filterShown: false,
        minPrice: this.props.minPrice,
        maxPrice: this.props.maxPrice,
        canApplyFilter: false
    };

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

    handleKeyDownPriceInput = (event: any) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            event.preventDefault();
            return false;
        }
        return true;
    }

    handleChangeMinPrice = (event: any) => {
        const newValue = Number(event.target.value);
        if (newValue < this.props.minPrice || newValue > this.props.maxPrice) {
            return;
        }

        this.setState({minPrice: newValue, canApplyFilter: true});
    }

    handleChangeMaxPrice = (event: any) => {
        const newValue = Number(event.target.value);
        if (newValue > this.props.maxPrice || newValue < this.props.minPrice) {
            return;
        }

        this.setState({maxPrice: newValue, canApplyFilter: true});
    }

    handleClickApplyFilter = () => {
        this.setState({canApplyFilter: false});
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
                    <IconButton onClick={this.performSearch}>
                        <Icon>search</Icon>
                    </IconButton>
                    <IconButton onClick={this.handleClickFilter}>
                        <Icon>filter_list</Icon>
                    </IconButton>
                </Card>
                {this.state.filterShown &&
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="subheading" component="h2">Filter opties</Typography>
                        <Typography variant="caption" component="p">Prijs</Typography>
                        <FormControl style={{width: 100}}>
                            <Input 
                                startAdornment={<InputAdornment position="start">&euro;</InputAdornment>} 
                                type="number" 
                                value={this.state.minPrice}
                                onChange={this.handleChangeMinPrice}
                                onKeyDown={this.handleKeyDownPriceInput}
                            /> 
                        </FormControl>
                        <Typography variant="caption" component="p" style={{display: 'inline-block', marginLeft: 10, marginRight: 10}}>tot</Typography>
                        <FormControl style={{width: 100}}>
                            <Input 
                                startAdornment={<InputAdornment position="start">&euro;</InputAdornment>} 
                                type="number" 
                                value={this.state.maxPrice}
                                onChange={this.handleChangeMaxPrice}
                                onKeyDown={this.handleKeyDownPriceInput}
                            /> 
                        </FormControl>
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