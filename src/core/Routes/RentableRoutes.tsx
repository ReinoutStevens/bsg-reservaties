import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import Rentables from "../../admin/Rentable/Rentables";
import NewRentable from "../../admin/Rentable/NewRentable";

const RentableRoutes: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <>
      <Route path={`${match.path}/`} exact component={Rentables} />
      <Route path={`${match.path}/new`} exact component={NewRentable} />
    </>
  );
}

export default RentableRoutes;
