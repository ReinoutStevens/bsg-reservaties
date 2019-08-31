import React from 'react';
import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(3, 0, 2),
    },
    input: {
      display: 'none',
    },
  }),
);

const FormButton: React.FC<ButtonProps> = (props) => {
  const classes = useStyles();
  return (
    <Button
      {...props}
      variant="contained"
      className={classes.button}
    />
  );
};

export default FormButton;
