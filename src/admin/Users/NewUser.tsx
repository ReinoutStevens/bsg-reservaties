import React from 'react';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { CircularProgress } from '@material-ui/core';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';
import validEmail from '../../util/validEmail';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Form from '../../core/Form/Form';
import FormField from '../../core/Form/FormField';
import FormButton from '../../core/Form/FormButton';

interface NewUserProps {
}

interface NewUserState {
  saving: boolean;
  email: string;
  displayName: string;
}

type NewUserProps_ = NewUserProps & WithSnackbarProps & WithFirebase;

class NewUser extends React.Component<NewUserProps_, NewUserState> {
  constructor(props: NewUserProps_) {
    super(props);
    this.state = {
      saving: false,
      email: '',
      displayName: '',
    }
  }

  render() {
    const { email, displayName } = this.state;
    return (
      <Form title="Create User" icon={<PersonAddIcon />}>
        <FormField
          variant="outlined"
          value={displayName}
          label="Name"
          onChange={this.onDisplayNameChange}
          required
          fullWidth
        />
        <FormField
          variant="outlined"
          value={email}
          onChange={this.onEmailChange}
          type="email"
          label="Email"
          required
          fullWidth
        />
        {this.renderButton()}
      </Form>
    );
  }

  private renderButton() {
    const { saving } = this.state;
    if (saving) {
      return <CircularProgress size={24} />
    } else {
      return (
        <FormButton
          onClick={this.submit}
          disabled={!this.canSubmit()}
          type="submit"
          color="primary"
          fullWidth
        >
          Create User
        </FormButton>
      );
    }
  }

  private canSubmit(): boolean {
    const { email, displayName } = this.state;
    return displayName.length > 0 && validEmail(email);
  }

  private submit = async () => {
    this.setState({ saving: true });
    const { firebase } = this.props;
    const { email, displayName } = this.state;
    try {
      await firebase.createUser({ email, displayName });
      this.props.enqueueSnackbar('Invitation email sent');
      this.setState({ saving: false, email: '', displayName: '' });
    } catch (e) {
      console.error(e);
      this.props.enqueueSnackbar('Failed creating account', { variant: 'error' });
      this.setState({ saving: false });
    }
  }

  private onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.currentTarget.value });
  }

  private onDisplayNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ displayName: ev.currentTarget.value });
  }
}

export default withFirebase(withSnackbar(NewUser));
