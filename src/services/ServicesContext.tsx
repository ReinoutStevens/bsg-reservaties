import React from 'react';
import EventServices from './EventServices';
import UserServices from './UserServices';

export interface ServicesContextProps {
  events: EventServices;
  users: UserServices;
}

const ServicesContext = React.createContext<ServicesContextProps | null>(null);

export default ServicesContext;
