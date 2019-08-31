import React from 'react';
import { Rentable } from '../../services/Rentable';
import Spinner from '../../core/Spinner';
import Typography from '@material-ui/core/Typography';
import RentablesTable from './RentablesTable';
import NewRentableFab from './NewRentableFab';
import withServices, { WithServices } from '../../services/withServices';

interface RentablesState {
  rentables: Rentable[];
  isLoading: boolean;
  error: string | null;
}

type RentablesProps_ = WithServices;

class Rentables extends React.Component<RentablesProps_, RentablesState> {

  constructor(props: RentablesProps_) {
    super(props);
    this.state = {
      rentables: [],
      isLoading: true,
      error: null,
    }
  }

  async componentDidMount() {
    const { services } = this.props;
    try {
      const rentables = await services.events.getRentables();
      this.setState({
        rentables: rentables,
        isLoading: false,
        error: null,
      })
    } catch (e) {
      this.setState({
        rentables: [],
        isLoading: false,
        error: e.message,
      })
    }
  }

  render() {
    return (
      <>
        {this.renderContent()}
        {this.renderActions()}
      </>
    )

  }

  private renderContent() {
    const { isLoading, error } = this.state;
    if (isLoading) {
      return <Spinner />;
    }
    if (error) {
      return this.renderError();
    }
    return this.renderRentables();
  }


  private renderError() {
    const { error } = this.state;
    return (
      <Typography color="error">
        {error}
      </Typography>
    )
  }

  private renderRentables() {
    return <RentablesTable rentables={this.state.rentables} />
  }

  private renderActions() {
    return (
      <>
        <NewRentableFab />
      </>
    );
  }
}

export default withServices(Rentables);
