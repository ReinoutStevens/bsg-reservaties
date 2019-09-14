import React from 'react';

import {
  Route,
  Redirect,
  RouteProps
} from 'react-router-dom';
import withFirebase, { WithFirebase } from '../Session/withFirebase';

export type AdminRouteProps = RouteProps & WithFirebase;

class AdminRoute extends React.Component<AdminRouteProps> {

  render() {
    const { currentUser, firebase } = this.props;
    const { component: Component, render, children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(route) => {
          if (!currentUser) {
            console.log('[AdminRoute] redirecting to /login');
            return <Redirect to={{ pathname: "/signin", state: { from: route.location } }} />;
          }
          if (!firebase.isAdmin()) {
            console.log('[AdminRoute] redirecting to /login');
            return <Redirect to={{ pathname: "/signin", state: { from: route.location } }} />;
          }
          if (Component) {
            return <Component {...route} />;
          }
          if (render) {
            return render(route);
          }
          if (children) {
            return <>{children}</>;
          }
          throw new Error('[AdminRoute] expected either component render or children to be set');
        }}
      />
    );
  }

}

export default withFirebase(AdminRoute);
