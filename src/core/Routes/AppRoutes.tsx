import React from "react";
import { Route } from "react-router-dom";
import PublicCalendar from "../EventsCalendar/PublicCalendar";
import AdminRoutes from "./AdminRoutes";
import SignUp from "../Users/SignUp";
import SignIn from "../Session/SignIn";
import ForgotPassword from "../Session/ForgotPassword";



const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={PublicCalendar} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/signin" exact component={SignIn} />
      <Route path="/pw-forget" exact component={ForgotPassword} />
      <Route path="/admin" component={AdminRoutes} />
    </>
  );
}

export default AppRoutes;
