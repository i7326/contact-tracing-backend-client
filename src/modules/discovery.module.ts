import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import micro from 'micro';
import { Container } from 'typedi';
import { router } from 'microrouter';
import { DiscoveryController } from '../app/controllers';
import { get } from 'config';

export const DiscoveryModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const server = micro(
      router(...Container.get(DiscoveryController).getRoutes())
    );
    server.listen(get("services.discovery"));
  }
};
