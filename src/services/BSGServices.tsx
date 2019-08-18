import { DateTime } from 'luxon';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { CalendarEvent, CreateCalendarEventInput } from './Events';

interface Rentable {
  id: string;
  name: string;
  color: string;
}

interface NewRentableInput {
  name: string;
  color: string;
}

interface NewUserInput {
  email: string;
  password: string;
}

class BSGServices {
  private static instance: BSGServices;

  static getInstance(): BSGServices {
    if (!BSGServices.instance) {
      BSGServices.instance = new BSGServices();
    }
    return BSGServices.instance;
  }


  private db: firebase.firestore.Firestore;
  private auth: firebase.auth.Auth;


  private constructor() {
    this.db = firebase.firestore();
    this.auth = firebase.auth();
  }

  async getApprovedEvents(start: DateTime, end: DateTime): Promise<CalendarEvent[]> {
    const snapshot = await this.db.collection('events')
      .where('start', '>=', start.toJSDate())
      .where('approved', '==', true)
      .orderBy('start')
      .orderBy('end', 'asc')
      .get();
    let events: CalendarEvent[] = [];
    for (const doc in snapshot.docs) {
      const res = snapshot.docs[doc];
      const data = res.data();
      if (end < data.end) {
        break;
      }
      const event: CalendarEvent = {
        id: res.id,
        start: DateTime.fromJSDate(data.start.toDate()),
        end: DateTime.fromJSDate(data.end.toDate()),
        title: data.title,
        description: data.description,
        approved: data.approved,
        rentableId: data.rentableId,
      };
      events.push(event);
    }
    return events;
  }

  async getAllEvents(start: DateTime, end: DateTime): Promise<CalendarEvent[]> {
    const snapshot = await this.db.collection('events')
      .where('start', '>=', start.toJSDate())
      .orderBy('start')
      .orderBy('end', 'asc')
      .get();
    let events: CalendarEvent[] = [];
    for (const doc in snapshot.docs) {
      const res = snapshot.docs[doc];
      const data = res.data();
      if (end < data.end) {
        break;
      }
      const event: CalendarEvent = {
        id: res.id,
        start: DateTime.fromJSDate(data.start.toDate()),
        end: DateTime.fromJSDate(data.end.toDate()),
        title: data.title,
        description: data.description,
        approved: data.approved,
        rentableId: data.rentableId,
      };
      events.push(event);
    }
    return events;
  }

  async createEvent(input: CreateCalendarEventInput): Promise<CalendarEvent> {
    const ev = {
      ...input,
      start: input.start.toJSDate(),
      end: input.end.toJSDate(),
      approved: false,
    }
    const ref = await this.db.collection('events').add(ev);
    return {
      ...input,
      approved: false,
      id: ref.id,
    };
  }

  async getRentables(): Promise<Rentable[]> {
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
    return rentables;
  }

  async createRentable(rentable: NewRentableInput): Promise<Rentable> {
    const ref = await this.db.collection('rentables').add({
      ...rentable,
      archived: false,
    });
    return {
      ...rentable,
      id: ref.id,
    }
  }



  async createUser(user: NewUserInput) {
    await this.auth.createUserWithEmailAndPassword(user.email, user.password);
    return user;
  }
}

export default BSGServices;
