import withFirebase, { WithFirebase } from "./withFirebase";
import React from 'react';
import { Typography, Grid, Link } from "@material-ui/core";
import validEmail from "../../util/validEmail";
import Form from "../Form/Form";
import FormField from "../Form/FormField";
import FormButton from "../Form/FormButton";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { withRouter, RouteComponentProps } from "react-router";

export interface ForgotPasswordProps {

}

export interface ForgotPasswordState {
  saving: boolean;
  email: string;
  error: string | null;
}


type ForgotPasswordProps_ = ForgotPasswordProps & WithFirebase & WithSnackbarProps & RouteComponentProps;


class ForgotPassword extends React.Component<ForgotPasswordProps_, ForgotPasswordState> {
  constructor(props: ForgotPasswordProps_) {
    super(props);
    this.state = {
      saving: false,
      email: '',
      error: null,
    };
  }

  render() {
    const { email } = this.state;
    return (
      <Form title="Reset Password">
        <FormField
          label="Email"
          value={email}
          onChange={this.onEmailChange}
          type="email"
          autoComplete="email"
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
          Reset Password
        </FormButton>
        {this.renderError()}
        <Grid container>
          <Grid item xs>
            <Link href="/signin" variant="body2">
              Sign In
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
    const { email } = this.state;
    return validEmail(email);
  }

  private onSubmit = async () => {
    const { firebase } = this.props;
    const { email } = this.state;
    try {
      this.setState({ error: null });
      await firebase.passwordReset(email);
    } catch (e) {
      (console).error(e);
      this.setState({ error: e.message });
    }
  };

  private onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.currentTarget.value });
  };
}

export default withRouter(withSnackbar(withFirebase(ForgotPassword)));
