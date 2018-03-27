import * as React from 'react';

import Card from 'material-ui/Card';
import TextField from 'material-ui/TextField';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

interface Props {
    // tslint:disable-next-line: no-any
    style?: any;
    onSearch?: (query: string) => void;
}
interface State {
    value: string;
}

export default class SearchBar extends React.Component<Props, State> {

    state = {
        value: ''
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

    performSearch = () => {
        if (this.props.onSearch !== undefined && this.state.value !== '') {
            this.props.onSearch(this.state.value);
        }
    }

    public render() {
        return (
            <div style={this.props.style}>
                <Card style={{padding: 5, paddingLeft: 10, paddingRight: 10}}>
                    <TextField 
                        label="Zoeken"
                        placeholder="Rock"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="search"
                        value={this.state.value}
                        onChange={this.handleChangeValue}
                        onKeyUp={this.handleKeyUp}
                        style={{marginRight: 5}}
                    />
                    <IconButton onClick={this.performSearch}>
                        <Icon>search</Icon>
                    </IconButton>
                </Card>
            </div>
        );
    }

}