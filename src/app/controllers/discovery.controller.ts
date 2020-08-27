import { get } from 'microrouter';
import { send, createError, json } from 'micro';
import { Inject } from 'typedi';

@Inject()
export class DiscoveryController {
    public getRoutes() {
        return ([
            // get('/discovery/organization', (req, res) => {
            //     send(res, 200, JSON.stringify({
            //         message: "hello"
            //     }));
            // })
        ])
    }
}