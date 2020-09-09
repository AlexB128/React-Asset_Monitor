import React from 'react';
import { Table, TableRow, TableCell } from '@material-ui/core';
import Plot from 'react-plotly.js';

class Asset extends React.Component {
    render() {
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: this.props.asset.custom_data.Weight,
              title: { text: "Weight" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [null, 30000] } }
            }
          ];

          var data1 = [
            {
              type: "indicator",
              mode: "number+gauge",
              gauge: { shape: "bullet" },
              delta: { reference: 120 },
              value: this.props.asset.custom_data.Temperature,
              domain: { x: [0, 1], y: [0, 1] },
              title: { text: "Temp." }
            }
          ];
        var layout = { width: 350, height: 300 };

        return (
            <Table>
                <colgroup>
                    <col style={{width:'30%'}}/>
                    <col style={{width:'70%'}}/>
                </colgroup>
                <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell>{this.props.asset.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Label</TableCell>
                    <TableCell>{this.props.asset.label}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Latitude</TableCell>
                    <TableCell>{this.props.asset.lat}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Longitude</TableCell>
                    <TableCell>{this.props.asset.lng}</TableCell>
                </TableRow>
                {/* <TableRow>
                    <TableCell align="left">Temperature</TableCell>
                    <TableCell>{this.props.asset.custom_data.Temperature}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Weight</TableCell>
                    <TableCell>{this.props.asset.custom_data.Weight}</TableCell>
                </TableRow> */}
                <TableRow>
                    <TableCell colSpan="2">
                        <Plot data={data1} layout={layout} />
                        <Plot data={data} layout={layout} />
                    </TableCell>
                </TableRow>
            </Table>            );
    }
}

export default Asset;