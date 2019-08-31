import React from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import MeetinRoomIcon from '@material-ui/icons/MeetingRoom';
import FormField from '../../core/Form/FormField';
import Form from '../../core/Form/Form';
import FormButton from '../../core/Form/FormButton';
import { createStyles } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/styles';
import withServices, { WithServices } from '../../services/withServices';

export interface NewRentableProps {

}

export interface NewRentableState {
  name: string;
  color: string | null;
}

const styles = () => createStyles({
  colorPicker: {
    margin: 'auto',
    width: '50%',
  }
});

type NewRentableProps_ = NewRentableProps & WithSnackbarProps & WithStyles<typeof styles> & WithServices;

class NewRentable extends React.Component<NewRentableProps_, NewRentableState> {
  constructor(props: NewRentableProps_) {
    super(props);
    this.state = {
      name: '',
      color: null,
    }
  }

  render() {
    return (
      <Form title="Create Rentable" icon={<MeetinRoomIcon />}>
        {this.renderNameField()}
        {this.renderColorPicker()}
        <FormButton onClick={this.save} color="primary" disabled={!this.canSave()}>
          Save
        </FormButton>
      </Form>
    );
  }

  private canSave(): boolean {
    const { color, name } = this.state;
    return !!(name && color && name.length > 0 && color.length > 0);
  }

  private save = () => {
    const { enqueueSnackbar, services } = this.props;
    const { name, color } = this.state;
    services.events.createRentable({ name, color: color! }).then((rentable) => {
      enqueueSnackbar(`Created ${rentable.name}`);
    }).catch(() => {
      enqueueSnackbar(`Failed saving ${name}`);
    });
  }

  private renderNameField() {
    return (
      <FormField
        onChange={this.changeName}
        label="Name"
        fullWidth
      />
    );
  }

  private renderColorPicker() {
    const { classes } = this.props;
    const { color } = this.state;
    return (
      <div className={classes.colorPicker}>
        <SketchPicker
          color={color || undefined}
          onChangeComplete={this.changeColor}
        />
      </div>
    );
  }

  private changeColor = (color: ColorResult) => {
    this.setState({ color: color.hex });
  }

  private changeName = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: ev.target.value });
  }
}

export default withStyles(styles)(withSnackbar(withServices(NewRentable)));
