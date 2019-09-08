import React from 'react';
import { makeStyles, AppBar, createStyles, Link, Toolbar, Theme, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      top: 'auto',
      bottom: 0,
    },
    link: {
      color: theme.palette.primary.contrastText,
    },
  }),
);

const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.footer}>
      <Toolbar>
        <Grid container justify="center">
          <Grid item>
            <Link
              className={classes.link}
              underline="none"
              href="https://github.com/ReinoutStevens/bsg-reservaties"
              target="_blank"
              color="primary"
            >
              <FontAwesomeIcon icon={["fab", "github"]} /> GitHub
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
