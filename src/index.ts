import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { DiscoveryModule, GatewayModule, AuthModule, DatabaseModule, ContactModule, EventModule, ChainModule } from './modules';
bootstrapMicroframework({
    loaders: [
        ChainModule,
        DatabaseModule,
        GatewayModule,
    //     DiscoveryModule,
        AuthModule,
    //     ContactModule,
       EventModule
    ],
})
    .then((framework) => {
        // setTimeout(() => {
        //   framework.shutdown().then(() => {
        //     console.log("Shutting Down");
        //   })
        // }, 172800000)

    }).catch(error => console.log('Application is crashed: ' + error));