import React from 'react';
import Mapbox from './components/Mapbox';
import Assets from './components/Assets';
import Asset from './components/Asset';
import Areas from './components/Areas';
import Area from './components/Area';
import Chart from './components/Chart';
import { withStyles } from '@material-ui/core/styles';
import { Grid, AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Accordion, AccordionSummary , AccordionDetails }  from '@material-ui/core';
import MenuIcon from  '@material-ui/icons/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField'
import { Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  root: {
    flexGrow: 1
    // width: '100%',
    // margin: theme.spacing.unit * 1,
    // overflowX: "auto"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  map: {
    minWidth: 480
  },
  grid: {
    marginLeft: 15
  },
  asset_id: {
    width: 50
  }
});

function inside(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
  
  var x = point[0], y = point[1];
  
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];
      
      var intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
}

const MoveAssetButtonText = "Move Asset";
const StopMoveAssetButtonText = "Stop Move Asset";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        area_index: 0,
        asset_index: 0,
        assets: null,
        areas: null,
        zoom: 4,
        center: {
          lat: 39,
          lng: -98
        },
        assetsInArea: {},
        message: "",
        temperatures: [],
        asset_id: "",
        movex: 0.01,
        movey: 0.01,
        move_button_text: "Move Asset",
        open: false,
        selected: false
    }
  }
  componentDidMount() {
    setInterval(this.refresh, 5000);
    this.refresh();
  }

  refresh = () => {
    // console.log("***************REFRESH***************")
    if (this.state.move_button_text === StopMoveAssetButtonText)
      this.moveAsset();

    this.getAreas()
    .then(res => {
      this.setState({
        areas: res
      });

      this.getTemperatures()
      .then(res => this.setState({
        temperatures: res
      }));

      this.getAssets()
      .then(res => {
        this.setState({
          assets: res
        });

        this.state.areas.forEach(area => {
          this.state.assets.forEach(asset => {
            let polygon = [];
        
            area.polygon.forEach(c => {
              polygon.push([c.long, c.lat]);
            })

            if (inside([ asset.lng, asset.lat ], polygon)) {
              if (!this.state.assetsInArea[asset.id]) {
                this.setState({
                  assetsInArea: {
                    ...this.state.assetsInArea,
                    [asset.id]: area.id 
                  }
                })
                // console.log(this.state.assetsInArea);
                this.setState({
                  message: `[ ${new Date().toLocaleString()} ] ${asset.label} entered ${area.label}\n` + this.state.message
                });
                // console.log(this.state.message);
              }
            }
            else {
                if (this.state.assetsInArea[asset.id] === area.id) {
                  this.setState({
                    message: `[ ${new Date().toLocaleString()} ] ${asset.label} left ${area.label}\n` + this.state.message
                  });
                  // console.log(this.state.message);
                  delete this.state.assetsInArea[asset.id]
                }
            // console.log(asset.id, area.id, inside([ asset.lng, asset.lat ], polygon));
            }
          });
        });
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }

  getAssets = async() => {
    const response = await fetch('/api/assets');
    const body = await response.json();
    return body;
  } 

  getAreas = async() => {
    const response = await fetch('/api/areas');
    const body = await response.json();
    return body;
  } 

  getTemperatures = async() => {
    const response = await fetch('/api/device_1_temperatures');
    const body = await response.json();
    return body;
  } 

  // asset change in asset select 
  onChangeAsset = (event) => {
    this.setState({
      asset_index: event.target.value,
      zoom:12,
      center: {
        lng: this.state.assets[event.target.value].lng,
        lat: this.state.assets[event.target.value].lat
      }
    });
  }

  // area change in area select 
  onChangeArea = (event) => {
    this.setState({
      area_index: event.target.value,
      zoom:12,
      center: {
        lng: this.state.areas[event.target.value].lng,
        lat: this.state.areas[event.target.value].lat
      }
    });
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  moveAsset = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        movex: this.state.movex, 
        movey: this.state.movey 
      })
    };
    fetch('/api/assets/' + this.state.asset_id, requestOptions)
        .then(response => response.json());
  }

  // demo move the asset
  handleMoveAsset = () => {
    if (!this.state.asset_id) {
      this.setState({
        open: true
      });

      return;
    }

    let { move_button_text } = this.state;

    this.setState({
      move_button_text: move_button_text === StopMoveAssetButtonText ? MoveAssetButtonText : StopMoveAssetButtonText
    });
  }

  // close dialog
  handleClose = () => {
    this.setState({
        open:false
    });
  } 

  // user changes on map
  handleChangeMapbox = (lng, lat, zoom) => {
    // console.log(lng, lat, zoom);
    this.setState({
      zoom:zoom,
      center: {
        lng: lng,
        lat: lat
      }      
    });
  }

  // click a marker
  handleOnClickMarker = (asset_id) => {
    // console.log(asset_id);
    this.state.assets.forEach((a, idx) => {
      if (a.id === asset_id) {
        console.log(idx, a.id);
        this.setState({
          asset_index: idx
        });
        return;
      }
    });
  }

  // move a marker
  handleMarkerMove = (asset_id, lng, lat) => {
    // console.log(asset_id, lng, lat);

    this.handleOnClickMarker(asset_id);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        lng: lng, 
        lat: lat 
      })
    };
    fetch('/api/assets/' + asset_id, requestOptions)
        .then(response => response.json());
  }
  
  setSelected = () => {
    const { selected } = this.state;
    this.setState({
      selected: !selected
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        topic: 'device/_edge/Ubuntu', 
        msg: selected ? "Raw" : "Smooth" 
      })
    };
    fetch('/api/messages/', requestOptions)
        .then(response => response.json());    
  }

  render() {
    const { classes } = this.props;
    let body = "";
    
    if (this.state.assets) {
      body = (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Mapbox assets={this.state.assets} areas={this.state.areas} center={this.state.center} zoom={this.state.zoom} className={styles.map}
               onChange={this.handleChangeMapbox} onClick={this.handleOnClickMarker} onMove={this.handleMarkerMove} />
            </Grid>
            <Grid item xs={6}>
              <Assets assets={this.state.assets} index={this.state.asset_index} onChange={this.onChangeAsset} />
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Asset Information
                </AccordionSummary>
                <AccordionDetails>
                  <Asset asset={this.state.assets[this.state.asset_index]} />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={6}>
              <Areas areas={this.state.areas} onChange={this.onChangeArea} />
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Area Information
                </AccordionSummary>
                <AccordionDetails>
                  <Area area={this.state.areas[this.state.area_index]} />
                </AccordionDetails>
              </Accordion>              
            </Grid>
            <Grid item xs={6}>
              <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                  Asset Events
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      placeholder="Asset Events"
                      multiline
                      rows={5}
                      value={this.state.message}
                      fullWidth={true}
                    />
                  </AccordionDetails>
                </Accordion>    
            </Grid>
            <Grid item xs={6}>
              <Accordion fullWidth>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Demo
                </AccordionSummary>
                <AccordionDetails>
                <Grid item xs={2}>
                    <TextField label="ID" type="text" fullWidth value={this.state.asset_id} name="asset_id" onChange={this.handleValueChange}  className={classes.grid} />
                  </Grid>
                  <Grid item xs={1}>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField label="Longitude: " type="text" fullWidth value={this.state.movex} name="movex" onChange={this.handleValueChange} />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField label="Latitude: " type="text" fullWidth value={this.state.movey} name="movey" onChange={this.handleValueChange} />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="primary" onClick={this.handleMoveAsset} >
                      {this.state.move_button_text}
                    </Button>
                  </Grid>
                  <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle onClose={this.handleClose}>
                        Warning
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Input asset id.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
                </AccordionDetails>
              </Accordion>  
            </Grid>
            <Grid item xs={12}>
              <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                  Temperature Monitor
                  </AccordionSummary>
                  <AccordionDetails>
                    <Chart temperatures={this.state.temperatures} />
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.selected}
                            onChange={this.setSelected}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        label="Smooth"
                      />
                    </FormGroup>

                  </AccordionDetails>
                </Accordion>    
            </Grid>
          </Grid>
      ); 
    }
        
    return (
      <Grid className={classes.root} >
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Asset Monitor
            </Typography>
          </Toolbar>
        </AppBar>
        { body }
      </Grid>
    )
  }
}
 
export default withStyles(styles)(App);
