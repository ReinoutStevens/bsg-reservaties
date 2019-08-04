import { DateTime } from 'luxon';
import firebase from 'firebase/app';
import 'firebase/firestore';


interface CalendarEvent {
  id: string;
  from: DateTime;
  to: DateTime;
  name: string;
  approved: boolean;
  rentableId?: string;
}

interface Rentable {
  id: string;
  name: string;
  color: string;
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


  private constructor() {
    this.db = firebase.firestore();
  }

  async getApprovedEvents(from: DateTime, to: DateTime): Promise<CalendarEvent[]> {
    const snapshot = await this.db.collection('events')
      .where('from', '>=', from.toJSDate())
      .where('to', '<', to.toJSDate())
      .where('approved', '==', true)
      .orderBy('from')
      .get();
    let events: CalendarEvent[] = [];
    snapshot.forEach((res) => {
      const data = res.data();
      const event: CalendarEvent = {
        id: res.id,
        from: DateTime.fromISO(data.from),
        to: DateTime.fromISO(data.to),
        name: data.name,
        approved: data.approved,
        rentableId: data.rentableId,
      };
      events.push(event);
    });
    return events;
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
}

export default BSGServices;
