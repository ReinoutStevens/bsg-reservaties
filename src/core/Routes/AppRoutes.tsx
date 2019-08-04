import React from "react";
import { Route } from "react-router-dom";
import EventsCalendar from "../EventsCalendar/EventsCalendar";
import Rentables from "../../admin/Rentable/Rentables";



const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={EventsCalendar} />
      <Route path="/rentables" component={Rentables} />
    </>
  );
}

export default AppRoutes;
