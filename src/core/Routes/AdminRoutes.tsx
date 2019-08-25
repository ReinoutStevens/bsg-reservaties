import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import AdminCalendar from "../../admin/Events/AdminCalendar";
import NewUser from "../../admin/Users/NewUser";
import Rentables from "../../admin/Rentable/Rentables";

const AdminRoutes: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <>
      <Route path={`${match.path}/events`} exact component={AdminCalendar} />
      <Route path={`${match.path}/users`} exact component={NewUser} />
      <Route path={`${match.path}/rentables`} exact component={Rentables} />
    </>
  );
}

export default AdminRoutes;
