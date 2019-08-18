import React from "react";
import { Route } from "react-router-dom";
import PublicCalendar from "../EventsCalendar/PublicCalendar";
import Rentables from "../../admin/Rentable/Rentables";
import AdminCalendar from "../../admin/Events/AdminCalendar";



const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={PublicCalendar} />
      <Route path="/rentables" component={Rentables} />
      <Route path="/events" component={AdminCalendar} />
    </>
  );
}

export default AppRoutes;
