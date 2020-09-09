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

class Areas extends React.Component {
    areas = this.props.areas.map((a, i) => 
        //<option value={i} key={a.id}>{a.label}</option>
        <MenuItem value={i} key={a.id}>{a.label}</MenuItem>
    )
    render() {
        const { classes } = this.props;        
        return (
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Select Area</InputLabel>
                <Select onChange={this.props.onChange} >
                    {this.areas}
                </Select>    
            </FormControl>
        );
    }
}

export default withStyles(syles)(Areas);