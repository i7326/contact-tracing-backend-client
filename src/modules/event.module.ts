import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { Container } from 'typedi';
import { EventController } from '../app/controllers';
export const EventModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        Container.get(EventController).init()
    }
};