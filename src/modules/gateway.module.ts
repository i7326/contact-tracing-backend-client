import * as cors from 'cors';
import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { get } from 'config';
import * as gateway from 'fast-gateway';

export const GatewayModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const server = gateway({
            middlewares: [
                cors()
            ],
            pathRegex: '*',
            routes: [
                {
                    prefix: '/auth/*',
                    target: `http://localhost:${get("services.auth")}`,
                },
                {
                    prefix: '/contacts',
                    target: `http://localhost:${get("services.contact")}`,
                    prefixRewrite: '/contacts',
                },
                {
                    prefix: '/contacts/*',
                    target: `http://localhost:${get("services.contact")}`,
                },
                {
                    prefix: '/discovery/*',
                    target: `http://localhost:${get("services.discovery")}`,
                }
            ]
        })

        server.start(<number>get("gateway")).then((res) => {
            console.log("started");
        });
        settings.onShutdown(() => server.close());
    }
};