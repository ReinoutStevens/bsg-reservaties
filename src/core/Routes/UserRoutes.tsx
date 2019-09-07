import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import Events from "../../user/Events/Events";
import NewEvent from "../../user/Events/NewEvent";

const UserRoutes: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <>
      <Route path={`${match.path}/events`} exact component={Events} />
      <Route path={`${match.path}/events/new`} exact component={NewEvent} />
    </>
  );
}

export default UserRoutes;
