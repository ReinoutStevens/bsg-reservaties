import React from 'react';

import {
  Route,
  Redirect,
  RouteProps
} from 'react-router-dom';
import withFirebase, { WithFirebase } from '../Session/withFirebase';

export type AuthenticatedRouteProps = RouteProps & WithFirebase;

class AuthenticatedRoute extends React.Component<AuthenticatedRouteProps> {

  render() {
    const { currentUser } = this.props;
    const { component: Component, render, children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(route) => {
          if (!currentUser) {
            console.log('[AuthenticatedRoute] redirecting to /login');
            return <Redirect to="/signin" />;
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
          throw new Error('[AuthenticatedRoute] expected either component render or children to be set');
        }}
      />
    );
  }

}

export default withFirebase(AuthenticatedRoute);
