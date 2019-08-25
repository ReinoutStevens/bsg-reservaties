import withFirebase, { WithFirebase } from "./withFirebase";
import React from 'react';
import { Typography, Grid, Link } from "@material-ui/core";
import validEmail from "../../util/validEmail";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import FormButton from "../Form/FormButton";

export interface SignInProps {

}

export interface SignInState {
  saving: boolean;
  email: string;
  password: string;
  error: string | null;
}


type SignInProps_ = SignInProps & WithFirebase;


class SignIn extends React.Component<SignInProps_, SignInState> {
  constructor(props: SignInProps_) {
    super(props);
    this.state = {
      saving: false,
      email: '',
      password: '',
      error: null,
    };
  }

  render() {
    const { email, password } = this.state;
    return (
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
            <Link href="#" variant="body2">
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

  private onSubmit = async () => {
    const { firebase } = this.props;
    const { email, password } = this.state;
    try {
      this.setState({ error: null });
      await firebase.signIn({ email, password });
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
}

export default withFirebase(SignIn);
