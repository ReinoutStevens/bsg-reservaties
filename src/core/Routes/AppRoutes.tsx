import React from "react";
import { Route } from "react-router-dom";
import PublicCalendar from "../EventsCalendar/PublicCalendar";
import AdminRoutes from "./AdminRoutes";
import SignUp from "../Users/SignUp";
import SignIn from "../Session/SignIn";
import ForgotPassword from "../Session/ForgotPassword";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import UserRoutes from "./UserRoutes";



const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" exact component={PublicCalendar} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/signin" exact component={SignIn} />
      <Route path="/pw-forget" exact component={ForgotPassword} />
      <UserRoute path="/user" component={UserRoutes} />
      <AdminRoute path="/admin" component={AdminRoutes} />
    </>
  );
}

export default AppRoutes;
