import React from 'react';
import { Rentable } from '../../services/Rentable';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Theme, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';


const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
});

export interface RentablesTableProps {
  rentables: Rentable[],
}

type RentablesTableProps_ = WithStyles<typeof styles> & RentablesTableProps;

class RentablesTable extends React.Component<RentablesTableProps_> {

  render() {
    const { classes, rentables } = this.props;
    return (

      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentables.map(rentable => (
              <TableRow key={rentable.id}>
                <TableCell component="th" scope="row">
                  {rentable.name}
                </TableCell>
                <TableCell size="small"><div style={{ backgroundColor: rentable.color, color: rentable.color }}>{rentable.color}</div></TableCell>
                <TableCell align="right">{this.renderAction(rentable)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }

  renderAction(rentable: Rentable) {
    return (
      <>

      </>
    )
  }
}


export default withStyles(styles)(RentablesTable);
