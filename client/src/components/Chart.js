import React from 'react';
import Plot from 'react-plotly.js';

const data_size = 200;

class Chart extends React.Component {
    render() {
        let x = [];
        let y = [];
        // console.log(this.props.temperatures.length);
        if (this.props.temperatures) {            
            let temperatures = (this.props.temperatures.length > data_size) ? this.props.temperatures.slice(-data_size) : this.props.temperatures;

            temperatures.forEach(t => {
                x.push(new Date(t.timestamp).toLocaleTimeString());
                y.push(t.temperature);
            });
        } else {
            x = [1, 2, 3, 4, 5];
            y = [2, 6, 3, 3.5, 4.1];
        }

        return (
            <div>
                <Plot
                    data={[
                        {
                        x: x,
                        y: y,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'lightgreen'},
                        }
                    ]}
                    layout={ 
                        {
                            autosize: false,
                            width: 1000, 
                            height: 360, 
                            title: 'device_1_temperatures'
                        } 
                    }
                    config={{
                        responsive: true
                    }}
                />
            </div>
        );
    }
  }

  export default Chart;