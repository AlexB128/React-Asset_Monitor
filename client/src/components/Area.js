import React from 'react';
import { Table, TableRow, TableCell } from '@material-ui/core';

class Area extends React.Component {
    render() {
        return (
            <Table>
                <colgroup>
                    <col style={{width:'30%'}}/>
                    <col style={{width:'70%'}}/>
                </colgroup>
                <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell>{this.props.area.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Label</TableCell>
                    <TableCell>{this.props.area.label}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Latitude</TableCell>
                    <TableCell>{this.props.area.lat}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="left">Longitude</TableCell>
                    <TableCell>{this.props.area.lng}</TableCell>
                </TableRow>
            </Table>
        );
    }
}

export default Area;