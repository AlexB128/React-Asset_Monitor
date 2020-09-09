import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

const syles = theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    }
  });

class Assets extends React.Component {
    assets = this.props.assets.map((a, i) => 
        <MenuItem value={i} key={a.id} selected={(i === this.props.index)}>{a.label}</MenuItem>
    );
 
    render() {
        const { classes } = this.props;        
        return (
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Select Asset</InputLabel>
                <Select onChange={this.props.onChange} title="Select asset" value={this.props.index}>
                    {this.assets}
                </Select>    
            </FormControl>
        );
    }
}

export default withStyles(syles)(Assets);
