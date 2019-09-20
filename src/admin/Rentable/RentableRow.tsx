import React from 'react';
import { Rentable } from '../../services/Rentable';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import withServices, { WithServices } from '../../services/withServices';
import { withSnackbar, WithSnackbarProps } from 'notistack';

export interface RentableRowProps {
  rentable: Rentable;
  onDelete: (id: string) => void;
}

type RentableRowProps_ = RentableRowProps & WithServices & WithSnackbarProps;
const RentableRow: React.FC<RentableRowProps_> = ({ rentable, onDelete, services, enqueueSnackbar }) => {
  const deleteClick = async () => {
    await services.events.deleteRentable(rentable.id);
    enqueueSnackbar('Rentable deleted');
    onDelete(rentable.id);
  }
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {rentable.name}
      </TableCell>
      <TableCell size="small"><div style={{ backgroundColor: rentable.color, color: rentable.color }}>{rentable.color}</div></TableCell>
      <TableCell align="right">
        <div>
          <IconButton onClick={deleteClick} size="small">
            <DeleteIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default withSnackbar(withServices(RentableRow));
