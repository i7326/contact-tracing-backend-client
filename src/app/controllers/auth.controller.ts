import { post, get } from 'microrouter';
import { send, sendError, json } from 'micro';
import { AuthService, DiscoveryService, WalletService, TokenService, MessagingService } from '../services';
import { Context } from '../model';
import { pick } from 'lodash';
import { Inject } from 'typedi';
import * as redirect from 'micro-redirect';
import { mnemonicGenerate } from '@polkadot/util-crypto';

@Inject()
export class AuthController {
    constructor(private authService: AuthService, private tokenService: TokenService /*, private discoveryService: DiscoveryService, private caService: CAService, private walletService: WalletService, private messagingService: MessagingService */) {
    }
    public getRoutes() {
        return ([
            get('/auth/generate', async (req, res) => {
                let ctx: Context = new Context({
                    headers: req.headers,
                });
                send(res, 200, await new Promise((resolve, reject) => {
                    resolve(mnemonicGenerate(15));
                })) 
            }),
            post('/auth/register', async (req, res) => {
                let ctx: Context = new Context({
                    body: pick(await json(req), ['phrase'])
                })
                send(res, 200, await new Promise((resolve, reject) => {
                    this.authService.generateAddress(ctx)
                        .then(() => this.authService.saveUser(ctx))
                        .then(() => this.authService.appendUID(ctx))
                        .then(() => this.tokenService.createJWTToken(ctx, 'login'))
                        .then(() => {
                            resolve(ctx.data.token);
                        })
                        .catch((err) => {
                            sendError(req, res, {
                                statusCode: 400,
                                stack: err
                            });
                        })
                }));
            }),

            post('/auth/login', async (req, res) => {
                let ctx: Context = new Context({
                    headers: req.headers,
                    body: pick(await json(req), ['phrase'])
                })
                send(res, 200, await new Promise((resolve, reject) => {
                    this.authService.generateAddress(ctx)
                        .then(() => this.authService.getUser(ctx))
                        .then(() => {
                            if (ctx.user && ctx.user.address) {
                                return Promise.resolve()
                            }
                            try {
                                return resolve(redirect(res, 302, '/auth/register'))
                            } catch (err) {
                                console.log(err);
                            }
                            reject();
                        })
                            .then(() => this.authService.appendUID(ctx))
                            .then(() => this.tokenService.createJWTToken(ctx, 'login'))
                            .then(() => {
                                resolve(ctx.data.token);
                            })
                        .catch((err) => {
                            console.error(err);
                            sendError(req, res, {
                                statusCode: 400,
                                stack: err
                            });
                        })
                }));
            }),

            // post('/auth/notification-token', async (req, res) => {
            //     let ctx: Context = new Context({
            //         headers: req.headers,
            //         body: pick(await json(req), ['notificationToken'])
            //     });
            //     send(res, 200, await new Promise((resolve, reject) => {
            //         this.tokenService.verifyJWTToken(ctx)
            //             .then(() => this.authService.saveNotificationToken(ctx))
            //             .then(() => {
            //                 resolve(ctx.data.notificationToken);
            //             })
            //             .catch((err) => {
            //                 sendError(req, res, {
            //                     statusCode: 400,
            //                     stack: err
            //                 });
            //             })
            //     }))

            // })
        ])
    }
}