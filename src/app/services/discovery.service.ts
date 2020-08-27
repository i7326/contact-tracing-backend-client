import { Service } from 'typedi';
import { Context } from '../model/Context';
import { DataBaseService, DataBase } from '../services';
import { ObjectID } from 'mongodb';

@Service()
export class DiscoveryService {
    constructor(private databaseService: DataBaseService) {
    }

    public async getAllOrganizations(): Promise<any> {

    }

    public async getOrganization(ctx: Context): Promise<any> {
        try {
            let db = this.databaseService.DataBase;
            let collection = db!.collection('organizations');
            if (ctx.body && (typeof ctx.body.organization === 'string')) {
                try {
                    const organization = await collection.findOne({
                        _id: new ObjectID(ctx.body.organization)
                    })
                    if (!organization) throw new Error("No Organization Found");
                    ctx.update('user', { organization })
                } catch (err) {
                    throw new Error(err);
                }
            }
            if (ctx.user && (typeof ctx.user.organization === 'string')) {
                try {
                    const organization = await collection.findOne({
                        _id: new ObjectID(ctx.user.organization)
                    })
                    if (!organization) throw new Error("No Organization Found");
                    ctx.update('user', { organization })
                } catch (err) {
                    throw new Error(err);
                }
            }
        } catch (err) {
            console.log('DiscoveryService - getOrganization', err)
            throw new Error("Failed to Find Organization");
        }
        return
    }
}