import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import AdminCalendar from "../../admin/Events/AdminCalendar";

const UserRoutes: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <>
      <Route path={`${match.path}/events`} exact component={AdminCalendar} />
    </>
  );
}

export default UserRoutes;
