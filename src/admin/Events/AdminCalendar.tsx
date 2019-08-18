import React from 'react';
import BSGServices from '../../services/BSGServices';
import { DateTime } from 'luxon';
import NewEventDialog from './NewEventDialog';
import EventsCalendar from '../../core/EventsCalendar/EventsCalendar';

interface EventsState {
  start: DateTime | null;
  end: DateTime | null;
  allDay: boolean;
  dialogOpen: boolean;
}

class AdminCalendar extends React.Component<{}, EventsState> {

  constructor(props: {}) {
    super(props)
    this.state = {
      start: null,
      end: null,
      dialogOpen: false,
      allDay: false,
    }
  }


  render() {
    const { dialogOpen, start, end, allDay } = this.state;
    return (
      <>
        <EventsCalendar
          events={this.getEvents}
          calendarProps={
            {
              selectable: true,
              selectConstraint: {
                start: '00:01',
                end: '23:59',
              },
              dateClick: this.handleDateClick,
              select: this.handleDateSelect,
            }
          }
        />
        <NewEventDialog
          open={dialogOpen}
          start={start}
          end={end}
          onClose={this.onDialogClose}
          allDay={allDay}
        />
      </>
    )
  }


  handleDateClick = (arg: {
    date: Date;
    allDay: boolean;
  }) => {
    const { date, allDay } = arg;
    this.setState({
      start: DateTime.fromJSDate(date),
      dialogOpen: true,
      allDay: allDay,
    });
  }

  handleDateSelect = (arg: {
    start: Date;
    end: Date;
    allDay: boolean;
  }) => {
    const { start, end, allDay } = arg;
    this.setState({
      start: DateTime.fromJSDate(start),
      end: DateTime.fromJSDate(end),
      dialogOpen: true,
      allDay: allDay,
    });
  }

  private onDialogClose = () => {
    this.setState({
      dialogOpen: false,
    })
  }

  private getEvents = (start: DateTime, end: DateTime) => {
    return BSGServices.getInstance().getAllEvents(start, end);
  }
}

export default AdminCalendar;
