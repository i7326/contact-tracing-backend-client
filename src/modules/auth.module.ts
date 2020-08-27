import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import micro from 'micro';
import { Container } from 'typedi';
import { router } from 'microrouter';
import { AuthController } from '../app/controllers';
import { get } from 'config';
import * as admin from 'firebase-admin';

export const AuthModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
      const server = micro(
        router(...Container.get(AuthController).getRoutes())
      );
      server.listen(get("services.auth"));
      admin.initializeApp({
        credential: admin.credential.cert(get("firebase"))
      });
    }
  };
  