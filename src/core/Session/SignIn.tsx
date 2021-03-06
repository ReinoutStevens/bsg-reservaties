import withFirebase, { WithFirebase } from "./withFirebase";
import React from 'react';
import { Typography, Grid, Link } from "@material-ui/core";
import validEmail from "../../util/validEmail";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import FormButton from "../Form/FormButton";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { withRouter, RouteComponentProps, Redirect } from "react-router";

export interface SignInProps {
}

export interface SignInState {
  saving: boolean;
  email: string;
  password: string;
  error: string | null;
  redirect: boolean;
}


type SignInProps_ = SignInProps & WithFirebase & WithSnackbarProps & RouteComponentProps;


class SignIn extends React.Component<SignInProps_, SignInState> {
  constructor(props: SignInProps_) {
    super(props);
    this.state = {
      saving: false,
      email: '',
      password: '',
      error: null,
      redirect: false,
    };
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.setState({ redirect: true });
    }
  }

  componentDidUpdate(prevProps: SignInProps_) {
    if (prevProps.currentUser !== this.props.currentUser) {
      if (this.props.currentUser) {
        if (!this.state.redirect) {
          this.setState({ redirect: true });
        }
      }
    }
  }

  render() {
    const { email, password } = this.state;
    return (
      <>
        <Form title="Sign In" icon={<LockOutlinedIcon />}>
          <FormField
            label="Email"
            value={email}
            onChange={this.onEmailChange}
            type="email"
            autoComplete="email"
            fullWidth
            required
          />
          <FormField
            label="Password"
            value={password}
            onChange={this.onPasswordChange}
            type="password"
            fullWidth
            required
          />

          <FormButton
            disabled={!this.canSubmit()}
            type="submit"
            color="primary"
            onClick={this.onSubmit}
            fullWidth
          >
            Sign In
        </FormButton>
          {this.renderError()}
          <Grid container>
            <Grid item xs>
              <Link href="/pw-forget" variant="body2">
                Forgot password?
            </Link>
            </Grid>
            <Grid item>
              <Link href="mailto:bsggtgv@gmail.com" variant="body2">
                {"Need an account? "}
              </Link>
            </Grid>
          </Grid>
        </Form>
        {this.redirect()}
      </>
    );
  }

  private renderError() {
    const { error } = this.state;
    if (!error) {
      return null;
    }
    return <Typography color="error">{error}</Typography>
  }

  private canSubmit(): boolean {
    const { email, password } = this.state;
    return validEmail(email) && password.length > 0;
  }

  private onSubmit = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    const { firebase, enqueueSnackbar } = this.props;
    const { email, password } = this.state;
    try {
      this.setState({ error: null });
      await firebase.signIn({ email, password });
      enqueueSnackbar('Successfully logged in');
      this.setState({ redirect: true });
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  private onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.currentTarget.value });
  };

  private onPasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: ev.currentTarget.value });
  }

  private redirect() {
    const { redirect } = this.state;
    if (!redirect) {
      return null;
    }
    const to = this.redirectTo();
    return <Redirect to={to || '/'} />;
  }

  private redirectTo() {
    const { location } = this.props;
    if (!location || !location.state) {
      return '/';
    }
    const { from } = location.state;
    if (!from) {
      return '/';
    } else {
      return from;
    }
  }
}

export default withRouter(withSnackbar(withFirebase(SignIn)));
