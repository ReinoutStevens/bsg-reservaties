import { DateTime } from 'luxon';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { CalendarEvent, CreateCalendarEventInput, UpdateCalendarEventInput, ApproveCalendarEventInput } from './Events';
import Firebase from '../core/Session/Firebase';

interface Rentable {
  id: string;
  name: string;
  color: string;
}

interface NewRentableInput {
  name: string;
  color: string;
}

const approvedColl = 'events';
const unapprovedColl = 'unapproved_events';

class EventServices {

  private db: firebase.firestore.Firestore;
  private rentables: Rentable[] | null;

  constructor(firebase: Firebase) {
    this.db = firebase.db;
    this.rentables = null;
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    const approvedPromise = this.db.collection(approvedColl).doc(id).get();
    const unapprovedPromise = this.db.collection(unapprovedColl).doc(id).get();
    const rentablesPromise = this.getRentables();
    const [approved, unapproved, rentables] = await Promise.all([
      approvedPromise,
      unapprovedPromise,
      rentablesPromise,
    ]);
    if (approved.exists) {
      return this.mapEvent(approved, approved.data()!, rentables);
    } else if (unapproved.exists) {
      return this.mapEvent(unapproved, unapproved.data()!, rentables);
    } else {
      throw new Error('Expected to find event');
    }
  }

  async getApprovedEvents(start: DateTime, end: DateTime): Promise<CalendarEvent[]> {
    const snapshotPromise = this.db.collection(approvedColl)
      .where('start', '>=', start.toJSDate())
      .orderBy('start')
      .orderBy('end', 'asc')
      .get();
    const rentablesPromise = this.getRentables();
    const [snapshot, rentables] = await Promise.all([snapshotPromise, rentablesPromise]);
    let events: CalendarEvent[] = [];
    for (const doc in snapshot.docs) {
      const res = snapshot.docs[doc];
      const data = res.data();
      if (end < data.end) {
        break;
      }
      const event = this.mapEvent(res, data, rentables);

      events.push(event);
    }
    return events;
  }

  async getUnapprovedEvents(): Promise<CalendarEvent[]> {
    const snapshotPromise = this.db.collection(unapprovedColl)
      .get();
    const rentablesPromise = this.getRentables();
    const [snapshot, rentables] = await Promise.all([snapshotPromise, rentablesPromise]);
    let events: CalendarEvent[] = [];
    snapshot.forEach((doc) => {
      const eventData = doc.data();
      const event = this.mapEvent(doc, eventData, rentables);
      events.push(event);
    });
    const sorted = events.sort((a, b) => a.start.valueOf() - b.start.valueOf());
    return sorted;
  }

  async getAllEvents(start: DateTime, end: DateTime): Promise<CalendarEvent[]> {
    const [approved, unapproved] = await Promise.all([
      this.getAllApprovedEvents(start, end),
      this.getAllUnapprovedEvents(start, end),
    ]);
    return approved.concat(unapproved);
  }

  async getAllUnapprovedEvents(start: DateTime, end: DateTime): Promise<CalendarEvent[]> {
    const snapshotPromise = this.db.collection(unapprovedColl)
      .where('start', '>=', start.toJSDate())
      .orderBy('start')
      .orderBy('end', 'asc')
      .get();
    const rentablesPromise = this.getRentables();
    const [snapshot, rentables] = await Promise.all([snapshotPromise, rentablesPromise]);
    let events: CalendarEvent[] = [];
    for (const doc in snapshot.docs) {
      const res = snapshot.docs[doc];
      const data = res.data();
      if (end < data.end) {
        break;
      }
      const event = this.mapEvent(res, data, rentables);

      events.push(event);
    }
    return events;
  }

  async getAllApprovedEvents(start: DateTime, end: DateTime): Promise<CalendarEvent[]> {
    const snapshotPromise = this.db.collection(approvedColl)
      .where('start', '>=', start.toJSDate())
      .orderBy('start')
      .orderBy('end', 'asc')
      .get();
    const rentablesPromise = this.getRentables();
    const [snapshot, rentables] = await Promise.all([snapshotPromise, rentablesPromise]);
    let events: CalendarEvent[] = [];
    for (const doc in snapshot.docs) {
      const res = snapshot.docs[doc];
      const data = res.data();
      if (end < data.end) {
        break;
      }
      const event = this.mapEvent(res, data, rentables);

      events.push(event);
    }
    return events;
  }

  async getUserEvents(uid: string, start: DateTime): Promise<CalendarEvent[]> {
    const [approved, unapproved] = await Promise.all([
      this.getUserApprovedEvents(uid, start),
      this.getUserUnapprovedEvents(uid, start),
    ]);
    return approved.concat(unapproved);
  }

  async getUserApprovedEvents(uid: string, start: DateTime): Promise<CalendarEvent[]> {
    const snapshotPromise = await this.db.collection(approvedColl)
      .where('userId', '==', uid)
      .where('start', '>=', start.toJSDate())
      .get();
    const rentablesPromise = this.getRentables();
    const [snapshot, rentables] = await Promise.all([snapshotPromise, rentablesPromise]);
    let events: CalendarEvent[] = [];
    snapshot.forEach((doc) => {
      const eventData = doc.data();
      const event = this.mapEvent(doc, eventData, rentables);
      events.push(event);
    });
    const sorted = events.sort((a, b) => a.start.valueOf() - b.start.valueOf());
    return sorted;
  }

  async getUserUnapprovedEvents(uid: string, start: DateTime): Promise<CalendarEvent[]> {
    const snapshotPromise = await this.db.collection(unapprovedColl)
      .where('userId', '==', uid)
      .where('start', '>=', start.toJSDate())
      .get();
    const rentablesPromise = this.getRentables();
    const [snapshot, rentables] = await Promise.all([snapshotPromise, rentablesPromise]);
    let events: CalendarEvent[] = [];
    snapshot.forEach((doc) => {
      const eventData = doc.data();
      const event = this.mapEvent(doc, eventData, rentables);
      events.push(event);
    });
    const sorted = events.sort((a, b) => a.start.valueOf() - b.start.valueOf());
    return sorted;
  }

  async createEvent(input: CreateCalendarEventInput): Promise<CalendarEvent> {
    const { day, ...rest } = input;
    const start = day.startOf('day');
    const end = day.endOf('day');
    const ev = {
      ...rest,
      start: start.toJSDate(),
      end: end.toJSDate(),
      approved: false,
    }
    const ref = await this.db.collection(unapprovedColl).add(ev);
    return {
      ...rest,
      approved: false,
      start,
      end,
      id: ref.id,
      rentable: await this.getRentable(input.rentableId),
    };
  }

  async createApprovedEvent(input: CreateCalendarEventInput): Promise<CalendarEvent> {
    const { day, ...rest } = input;
    const start = day.startOf('day');
    const end = day.endOf('day');
    const ev = {
      ...rest,
      start: start.toJSDate(),
      end: end.toJSDate(),
      approved: true,
    }
    const ref = await this.db.collection(approvedColl).add(ev);
    return {
      ...rest,
      approved: true,
      id: ref.id,
      start,
      end,
      rentable: await this.getRentable(input.rentableId),
    };
  }

  async updateEvent(input: UpdateCalendarEventInput): Promise<CalendarEvent> {
    const { day, id, ...rest } = input;
    const start = day.startOf('day');
    const end = day.endOf('day');
    const ev = {
      ...rest,
      start: start.toJSDate(),
      end: end.toJSDate(),
      approved: input.approved,
    }
    const collection = input.approved ? approvedColl : unapprovedColl;
    const ref = this.db.collection(collection).doc(id);
    await ref.update(ev);
    return {
      ...rest,
      id,
      start,
      end,
      rentable: await this.getRentable(input.rentableId),
    }
  }

  async approveEvent(input: ApproveCalendarEventInput): Promise<void> {
    const ref = this.db.collection(unapprovedColl).doc(input.id);
    const eventSnapshot = await ref.get();
    if (!eventSnapshot.exists) {
      throw new Error('Event does not exist');
    }
    const eventData = eventSnapshot.data();
    const newEvent = {
      ...eventData,
      id: eventSnapshot.id,
      approved: true,
    }
    await this.db.collection(approvedColl).add(newEvent);
    await ref.delete();
  }

  deleteEvent(eventId: string, approved: boolean): Promise<void> {
    const collection = approved ? approvedColl : unapprovedColl;
    return this.db.collection(collection).doc(eventId).delete();
  }

  async getRentables(): Promise<Rentable[]> {
    if (this.rentables) {
      return this.rentables;
    }
    const snapshot = await this.db.collection('rentables')
      .where('archived', '==', false)
      .get();
    let rentables: Rentable[] = [];
    snapshot.forEach((res) => {
      const data = res.data();
      const rentable: Rentable = {
        id: res.id,
        name: data.name,
        color: data.color,
      };
      rentables.push(rentable);
    });
    this.rentables = rentables;
    return rentables;
  }

  async createRentable(rentable: NewRentableInput): Promise<Rentable> {
    const ref = await this.db.collection('rentables').add({
      ...rentable,
      archived: false,
    });
    const newRentable = {
      ...rentable,
      id: ref.id,
    };
    if (this.rentables) {
      this.rentables = [...this.rentables, newRentable];
    }
    return newRentable;
  }

  deleteRentable(id: string) {
    return this.db.collection('rentables').doc(id).delete();
  }

  private mapEvent(
    docSnapshot: firebase.firestore.DocumentSnapshot,
    data: firebase.firestore.DocumentData,
    rentables: Rentable[]
  ): CalendarEvent {
    return {
      id: docSnapshot.id,
      start: DateTime.fromJSDate(data.start.toDate()),
      end: DateTime.fromJSDate(data.end.toDate()),
      title: data.title,
      description: data.description,
      approved: data.approved,
      rentable: data.rentableId ? rentables.find((r) => r.id === data.rentableId) : undefined,
      url: data.url,
      userId: data.userId,
    }
  }

  private async getRentable(id: string | null | undefined) {
    if (!id) {
      return undefined;
    }
    return (await this.getRentables()).find((r) => r.id === id);
  }
}

export default EventServices;
