import React from 'react';
import EventServices from './EventServices';

export interface ServicesContextProps {
  events: EventServices;
}

const ServicesContext = React.createContext<ServicesContextProps | null>(null);

export default ServicesContext;
