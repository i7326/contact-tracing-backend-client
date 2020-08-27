import { Service } from "typedi";
import { Context } from '../model/Context';
import { string, object, number } from 'yup';

@Service()
export class ContactService {

    public async addContact(ctx: Context): Promise<any> {
        try {
            const moduleName = 'contactTracing';
            const moduleFunc = 'addContact';

            ctx.update('body', { id: ctx.user.uid });
            const schema = object().shape({
                id: string().required(),
                contact_id: string().required(),
                timestamp: number().notRequired(),
            })
            if (!await schema.isValid(ctx.body)) throw new Error("Schema Mismatch");
            ctx.addData({
                moduleName,
                moduleFunc,
                contractArgs: JSON.stringify(schema.cast(ctx.body))
            })
        } catch (err) {
            console.error('ContactService - addContact', err)
            throw new Error("Failed to Validate Input");
        }

    }

    public async queryAllContacts(ctx: Context): Promise<any> {
        try {
            const moduleName = 'contactTracing';
            const moduleStore = 'addContact';
            ctx.addData({
                moduleName,
                moduleStore,
                contractArgs: JSON.stringify({ uid: ctx.user.uid })
            })
        } catch (err) {
            console.error('ContactService - queryAllContacts', err)
            throw new Error("Failed to Query Contacts");
        }

    }

    public async queryFlag(ctx: Context): Promise<any> {
        try {
            const contractName = 'contact_track';
            const contractFunc = 'queryFlag';
            ctx.addData({
                contractName,
                contractFunc,
                contractArgs: JSON.stringify({ uid: ctx.user.uid })
            })
        } catch (err) {
            console.error('ContactService - addFlag', err)
            throw new Error("Failed to Flag Contacts");
        }
    }

    public async addFlag(ctx: Context): Promise<any> {
        try {
            const contractName = 'contact_track';
            const contractFunc = 'addFlag';
            const schema = object().shape({
                uid: string().required(),
                timestamp: number().notRequired(),
                type: string().required().oneOf(["positive", "negative", "suspicious"])
            })
            if (!await schema.isValid(ctx.body)) throw new Error("Schema Mismatch");
            ctx.addData({
                contractName,
                contractFunc,
                contractArgs: JSON.stringify(schema.cast(ctx.body))
            })
        } catch (err) {
            console.error('ContactService - addFlag', err)
            throw new Error("Failed to Flag Contacts");
        }
    }
}