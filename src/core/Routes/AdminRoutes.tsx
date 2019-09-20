import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import NewUser from "../../admin/Users/NewUser";
import RentableRoutes from "./RentableRoutes";
import Events from "../../admin/Events/Events";
import Users from "../../admin/Users/Users";
import UpdateEventLoader from "../../admin/Events/UpdateEventLoader";
import NewEvent from "../../admin/Events/NewEvent";

const AdminRoutes: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <>
      <Route path={`${match.path}/events`} exact component={Events} />
      <Route path={`${match.path}/events/new`} exact component={NewEvent} />
      <Route path={`${match.path}/events/update/:id`} exact component={(props: RouteComponentProps<{ id: string }>) => <UpdateEventLoader id={props.match.params.id} />} />
      <Route path={`${match.path}/users`} exact component={Users} />
      <Route path={`${match.path}/users/new`} exact component={NewUser} />
      <Route path={`${match.path}/rentables`} component={RentableRoutes} />
    </>
  );
}

export default AdminRoutes;
