import { Inject } from 'typedi';
import { ContactService, WalletService, TokenService, ContractService, DiscoveryService, AuthService, MessagingService,ChainService } from '../services';
import { Context } from '../model';
@Inject()
export class EventController {
    constructor(private discoveryService: DiscoveryService, private walletService: WalletService, private tokenService: TokenService, private contractService: ContractService, private contactService: ContactService, private authService: AuthService, private messagingService: MessagingService, private chainService: ChainService) {
    }
    public async init() {
        console.log(await this.chainService.getHex());

        // setTimeout(async () => {
        //     const organization = '5e8e2249c045767a7c19167a'
        //     let ctx: Context = new Context({
        //         body: {
        //             organization
        //         }
        //     });
        //     await this.discoveryService.getOrganization(ctx)
        //         .then(() => this.caService.loadConfiguration(ctx))
        //         .then(() => this.walletService.loadWallet(ctx))
        //         .then(() => this.contractService.getContract(ctx));
        //     await ctx.data.contract.addContractListener(async (event) => {
        //         if (event.eventName === 'ContactFlagged') {
        //             ctx.update('user', { uid: 'admin' });
        //             const payload = JSON.parse(event.payload.toString('utf8'));
        //             await this.authService.getNotificationTokenByUID(ctx, payload.uid)
        //                 .then(() => {
        //                     ctx.addData({
        //                         notification: {
        //                             title: "Possible Exposure Detected",
        //                             body: "Possible Exposure to COVID 19 Detected. Please Sanitize and Quarantine yourself."
        //                         }
        //                     })
        //                     return this.messagingService.sendPushNotification(ctx)
        //                 })
        //             payload.contacts.forEach(async (contact) => {
        //                 ctx.update('body', { uid: contact, timestamp: + new Date(), type: "suspicious" });
        //                 await this.contactService.addFlag(ctx)
        //                 await this.contractService.runContract(ctx)
        //             });
        //         } else if (event.eventName === 'addFlagContact') {
        //             ctx.update('user', { uid: 'admin' });
        //             const payload = JSON.parse(event.payload.toString('utf8'));
        //             ctx.update('body', { uid: payload.uid, timestamp: payload.timestamp, type: "suspicious" });
        //             await this.contactService.addFlag(ctx)
        //             await this.contractService.runContract(ctx)
        //         }
        //     })

        // }, 3000);



    }
}