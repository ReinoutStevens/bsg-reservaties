import React from "react";
import { Route } from "react-router-dom";
import EventsCalendar from "../EventsCalendar/EventsCalendar";
import Rentables from "../../admin/Rentable/Rentables";
import Events from "../../admin/Events/Events";



const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={EventsCalendar} />
      <Route path="/rentables" component={Rentables} />
      <Route path="/events" component={Events} />
    </>
  );
}

export default AppRoutes;
