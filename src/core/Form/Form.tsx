import React from 'react';
import { Theme, createStyles, Container, Avatar, Typography } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/styles';

const styles = (theme: Theme) => createStyles({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  }
});

export interface FormProps {
  title?: string;
  icon?: React.ReactElement;
}

type FormProps_ = FormProps & WithStyles<typeof styles>;

const Form: React.FC<FormProps_> = ({ title, icon, children, classes }) => {
  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        {
          icon &&
          <Avatar className={classes.avatar}>
            {icon}
          </Avatar>
        }
        {
          title &&
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
        }
        <form className={classes.form}>
          {children}
        </form>
      </div>
    </Container>
  );
}

export default withStyles(styles)(Form);
