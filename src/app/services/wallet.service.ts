import { Identity, Wallets, Wallet } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import { Service } from "typedi";
import { Context } from '../model/Context';

@Service()
export class WalletService {

    constructor() {

    }

    public async loadWallet(ctx: Context): Promise<any> {
        try {
            ctx.addData({
                wallet: await Wallets.newCouchDBWallet(ctx.user.organization.couchdb_url)
            })
        } catch (err) {
            console.error('WalletService - loadWallet', err)
            throw new Error("Failed to Load Wallet");
        }
        return
    }

    public async getUserIdentity(ctx: Context): Promise<any> {
        try {
            ctx.user.identity = await ctx.data.wallet.get(ctx.user.uid);
        } catch (err) {
            console.error('WalletService - getUserIdentity', err)
            throw new Error("Failed to Get User Identity");
        }
        return
    }

    public async getAdminIdentity(ctx: Context): Promise<any> {
        let adminIdentity: Identity;
        try {
            adminIdentity = await ctx.data.wallet.get('admin');
            if (!adminIdentity) throw new Error("No Admin Found");
            ctx.addData({
                adminIdentity,
                adminProvider: ctx.data.wallet.getProviderRegistry().getProvider(adminIdentity.type)
            })
        } catch (err) {
            console.error('WalletService - getAdminIdentity', err);
            throw new Error("Failed to Get Admin Identity");
        }
        return
    }

    public async getAdminContext(ctx: Context): Promise<any> {
        try {
            ctx.addData({
                adminContext: await ctx.data.adminProvider.getUserContext(ctx.data.adminIdentity, 'admin')
            })
        } catch (err) {
            console.error('WalletService - getAdminContext', err)
            throw new Error("Failed to Get Admin Context");
        }
        return
    }

    public async addToWallet(ctx: Context): Promise<any> {
        try {
            await ctx.data.wallet.put(ctx.user.uid, ctx.data.x509Identity);
        } catch (err) {
            console.error('WalletService - addToWallet', err)
            throw new Error("Failed to Add user to Wallet");
        }
        return
    }


}