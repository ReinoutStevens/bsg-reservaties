import React from 'react';
import EventsCalendarContext, { EventsCalendarContextProps } from "./EventsCalendarContext";

export type WithCalendar = EventsCalendarContextProps;

function withCalendar<T extends WithCalendar = WithCalendar>(Component: React.ComponentType<T>):
  React.ComponentType<Omit<T, keyof WithCalendar>> {
  return class extends React.Component<Omit<T, keyof WithCalendar>> {
    render() {
      return (
        <EventsCalendarContext.Consumer>
          {(value) => {
            return <Component {...value} {...this.props as T} />
          }}
        </EventsCalendarContext.Consumer>
      );
    }
  }
}

export default withCalendar;
