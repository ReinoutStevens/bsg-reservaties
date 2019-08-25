import React from "react";
import { Route } from "react-router-dom";
import PublicCalendar from "../EventsCalendar/PublicCalendar";
import AdminRoutes from "./AdminRoutes";
import SignUp from "../Users/SignUp";



const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={PublicCalendar} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/admin" component={AdminRoutes} />
    </>
  );
}

export default AppRoutes;
