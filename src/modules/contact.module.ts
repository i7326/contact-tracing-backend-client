import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import micro from 'micro';
import { Container } from 'typedi';
import { router } from 'microrouter';
import { ContactController } from '../app/controllers';
import { get } from 'config';

export const ContactModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
      const server = micro(
        router(...Container.get(ContactController).getRoutes())
      );
      server.listen(get("services.contact"));
    }
  };
  