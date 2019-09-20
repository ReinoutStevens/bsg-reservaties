import React from 'react';
import { Rentable } from '../../services/Rentable';
import withServices, { WithServices } from '../../services/withServices';
import { InputLabel, NativeSelect, FormControl, Input } from '@material-ui/core';

export interface LocationFieldProps {
  rentableId: string | null;
  onChange: (rentableId: string | null) => void;
}

export interface LocationFieldState {
  rentables: Rentable[];
  loading: boolean;
}

type LocationFieldProps_ = LocationFieldProps & WithServices;
class LocationField extends React.Component<LocationFieldProps_, LocationFieldState> {
  constructor(props: LocationFieldProps_) {
    super(props);
    this.state = {
      rentables: [],
      loading: true,
    }
  }

  async componentDidMount() {
    const { services } = this.props;
    const rentables = await services.events.getRentables();
    this.setState({ loading: false, rentables: rentables });
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return null;
    }
    const { rentableId } = this.props;
    const { rentables } = this.state;
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor="location-select">Location</InputLabel>
        <NativeSelect
          value={rentableId || ''}
          onChange={this.selectRentable}
          inputProps={{
            name: 'Location',
            id: 'location-select',
          }}
          fullWidth
          variant="outlined"
          input={<Input name="Location" id="location-select" />}
        >
          <option value="" />
          {rentables.map((rentable) => {
            return (
              <option key={rentable.id} value={rentable.id}>{rentable.name}</option>
            );
          })}
        </NativeSelect>
      </FormControl>
    );
  }

  private selectRentable = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const { onChange } = this.props;
    const { value } = ev.currentTarget;
    if (value === '') {
      onChange(null);
    } else {
      onChange(ev.currentTarget.value);
    }
  }
}

export default withServices(LocationField);
