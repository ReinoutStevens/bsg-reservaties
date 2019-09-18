import React from 'react';
import { Rentable } from '../../services/Rentable';
import { makeStyles, Theme, createStyles, Avatar, Chip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/AddCircle';

export type RentableFilter = Rentable & { isActive: boolean };

export interface RentablesProps {
  rentables: RentableFilter[];
  onClick: (id: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(1),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  }),
);

const Rentables: React.FC<RentablesProps> = ({ rentables, onClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {rentables.map((rentable) => {
        return (
          <Chip
            key={rentable.id}
            variant={rentable.isActive ? 'default' : 'outlined'}
            avatar={<Avatar style={{ backgroundColor: rentable.color }} />}
            label={rentable.name}
            onDelete={() => onClick(rentable.id)}
            className={classes.chip}
            deleteIcon={rentable.isActive ? <CancelIcon /> : <AddIcon />}
          />
        );
      })}
    </div>
  );
}

export default Rentables;
