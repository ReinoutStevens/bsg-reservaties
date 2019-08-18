import React from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { Dialog, TextField, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import BSGServices from '../../services/BSGServices';
import { withSnackbar, WithSnackbarProps } from 'notistack';


export interface NewRentableDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface NewRentableDialogState {
  name: string;
  color: string | null;
}

type NewRentableDialogProps_ = NewRentableDialogProps & WithSnackbarProps;

class NewRentableDialog extends React.Component<NewRentableDialogProps_, NewRentableDialogState> {
  constructor(props: NewRentableDialogProps_) {
    super(props);
    this.state = {
      name: '',
      color: null,
    }
  }

  render() {
    const { open, onClose } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle>Create Rentable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new rentable (eg. a room, a mobile beertap, etc.)
                    </DialogContentText>
          {this.renderNameField()}
          {this.renderColorPicker()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.save} color="primary" disabled={!this.canSave()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private canSave(): boolean {
    const { color, name } = this.state;
    return !!(name && color && name.length > 0 && color.length > 0);
  }

  private save = () => {
    const { onClose, enqueueSnackbar } = this.props;
    const { name, color } = this.state;
    BSGServices.getInstance().createRentable({ name, color: color! }).then((rentable) => {
      enqueueSnackbar(`Created ${rentable.name}`);
    }).catch(() => {
      enqueueSnackbar(`Failed saving ${name}`);
    })
    onClose();

  }

  private renderNameField() {
    return (
      <TextField
        onChange={this.changeName}
        fullWidth
        margin="dense"
        label="Name"
      />
    );
  }

  private renderColorPicker() {
    const { color } = this.state;
    return (
      <SketchPicker color={color || undefined} onChangeComplete={this.changeColor} />
    );
  }

  private changeColor = (color: ColorResult) => {
    this.setState({ color: color.hex });
  }

  private changeName = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: ev.target.value });
  }
}

export default withSnackbar(NewRentableDialog);
