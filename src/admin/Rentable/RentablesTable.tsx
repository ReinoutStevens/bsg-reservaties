import React from 'react';
import { Rentable } from '../../services/Rentable';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import { Theme, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import RentableRow from './RentableRow';

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

export interface RentablesTableState {
  deletedIds: string[];
}

type RentablesTableProps_ = WithStyles<typeof styles> & RentablesTableProps;

class RentablesTable extends React.Component<RentablesTableProps_, RentablesTableState> {

  constructor(props: RentablesTableProps_) {
    super(props);
    this.state = {
      deletedIds: [],
    };
  }

  render() {
    const { classes } = this.props;
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
            {this.filteredRentables().map((rentable) => (
              <RentableRow
                key={rentable.id}
                rentable={rentable}
                onDelete={this.deleteRentable}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  private filteredRentables() {
    const { deletedIds } = this.state;
    const { rentables } = this.props;
    return rentables.filter((r) => !deletedIds.find((id) => id === r.id));
  }

  private deleteRentable = (id: string) => {
    const { deletedIds } = this.state;
    this.setState({
      deletedIds: [id, ...deletedIds],
    });
  }
}


export default withStyles(styles)(RentablesTable);
