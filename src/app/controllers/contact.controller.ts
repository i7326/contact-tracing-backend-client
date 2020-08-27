import { post, get } from 'microrouter';
import { send, sendError, json } from 'micro';
import { ContactService, WalletService, TokenService, ContractService, DiscoveryService } from '../services';
import { Context } from '../model';
import { Inject } from 'typedi';

@Inject()
export class ContactController {
    constructor(private discoveryService: DiscoveryService, private walletService: WalletService, private tokenService: TokenService, private contractService: ContractService, private contactService: ContactService) {
    }
    public getRoutes() {
        return ([
            post('/contacts/flag', async (req, res) => {
                let ctx: Context = new Context({
                    headers: req.headers,
                    body: await json(req)
                });
                send(res, 200, await new Promise((resolve, reject) => {
                    this.tokenService.verifyJWTToken(ctx)
                        .then(() => this.discoveryService.getOrganization(ctx))
                        // .then(() => this.caService.loadConfiguration(ctx))
                        .then(() => this.walletService.loadWallet(ctx))
                        .then(() => this.walletService.getUserIdentity(ctx))
                        .then(() => {
                            if (!ctx.user.identity) throw new Error("User Not found");
                            ctx.update('body', { uid: ctx.user.uid });
                            return this.contactService.addFlag(ctx)
                        })
                        .then(() => this.contractService.runContract(ctx))
                        .then(() => {
                            resolve("Flag Added");
                        })
                        .catch((err) => {
                            sendError(req, res, {
                                statusCode: 400,
                                stack: err
                            });
                        })
                }))
            }),
            get('/contacts/flag', async (req, res) => {
                let ctx: Context = new Context({
                    headers: req.headers,
                });
                send(res, 200, await new Promise((resolve, reject) => {
                    this.tokenService.verifyJWTToken(ctx)
                        .then(() => this.discoveryService.getOrganization(ctx))
                        // .then(() => this.caService.loadConfiguration(ctx))
                        .then(() => this.walletService.loadWallet(ctx))
                        .then(() => this.walletService.getUserIdentity(ctx))
                        .then(() => {
                            if (!ctx.user.identity) throw new Error("User Not found");
                            return this.contactService.queryFlag(ctx)
                        })
                        .then(() => this.contractService.evaluateContract(ctx))
                        .then(() => {
                            resolve(ctx.data.result);
                        })
                        .catch((err) => {
                            sendError(req, res, {
                                statusCode: 400,
                                stack: err
                            });
                        })
                }))
            }),
            post('/contacts', async (req, res) => {
                let ctx: Context = new Context({
                    headers: req.headers,
                    body: await json(req)
                })
                send(res, 200, await new Promise((resolve, reject) => {
                    this.tokenService.verifyJWTToken(ctx)
                        .then(() => this.contactService.addContact(ctx))
                        .then(() => this.contractService.runContract(ctx))
                        .then(() => {
                            resolve("Contact Added");
                        })
                        .catch((err) => {
                            sendError(req, res, {
                                statusCode: 400,
                                stack: err
                            });
                        })
                }));
            }),
            get('/contacts', async (req, res) => {
                let ctx: Context = new Context({
                    headers: req.headers,
                });
                send(res, 200, await new Promise((resolve, reject) => {
                    this.tokenService.verifyJWTToken(ctx)
                        .then(() => this.discoveryService.getOrganization(ctx))
                        // .then(() => this.caService.loadConfiguration(ctx))
                        .then(() => this.walletService.loadWallet(ctx))
                        .then(() => this.walletService.getUserIdentity(ctx))
                        .then(() => {
                            if (!ctx.user.identity) throw new Error("User Not found");
                            return this.contactService.queryAllContacts(ctx)
                        })
                        .then(() => this.contractService.evaluateContract(ctx))
                        .then(() => {
                            resolve(ctx.data.result);
                        })
                        .catch((err) => {
                            sendError(req, res, {
                                statusCode: 400,
                                stack: err
                            });
                        })
                }))
            })
        ])
    }
}