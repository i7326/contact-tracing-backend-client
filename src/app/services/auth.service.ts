import { DataBaseService, ChainService } from '../services';
import { Service } from 'typedi';
import * as pwd from 'pwd';
import { Context } from '../model';
import { createHash } from 'crypto';
import { v5 as uuid } from 'uuid';
import { head, assign } from 'lodash';
import { ObjectID } from 'mongodb';
import Keyring from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Compact, createType } from '@polkadot/types';
@Service()
export class AuthService {
    constructor(private databaseService: DataBaseService, private chainService: ChainService) {
    }

    public async generateAddress(ctx: Context) {
        const keyring = new Keyring({ type: 'sr25519' });
        try {
            const account = keyring.createFromUri(ctx.body.phrase.trim(), {}, "sr25519");
            ctx.addData({
                address: account.address
            })
        }
        catch (err) {
            console.log('AuthService - generateAddress', err)
            throw new Error("Failed to Generate sr25519 Address");
        }

    }

    public async generateHash(ctx: Context): Promise<any> {
        try {
            // const { salt, hash } = await new Promise((resolve, reject) => {
            //     try {
            //         pwd.hash(ctx.body.password, function (err, salt, hash) {
            //             if (err) reject(err)
            //             resolve({ salt, hash });
            //         })
            //     } catch (err) {
            //         reject(err)
            //     }
            // });
            const uid = uuid(ctx.body.mobile, createHash('md5').update(ctx.user.organization.domain).digest('hex'));
            ctx.update('body', { uid });
            ctx.update('user', { uid });
            //ctx.remove('body', 'password');
        } catch (err) {
            console.log('AuthService - generateHash', err)
            throw new Error("Failed to Generate Password Hash");
        }
        return
    }

    public async appendUID(ctx: Context): Promise<any> {
        //Add login to get from pool and assign
        let uuidPool_ref = await this.chainService.getLocalStorage("uuid_pool");
        try {
            
            let uid = uuidPool_ref.isSome ? new TextDecoder().decode(uuidPool_ref.unwrap().subarray(2)).substring(0, 36) : "";
            ctx.update('body',{
                uid,
                address: ctx.data.address
            });
            if (uid == "") {
                throw new Error("UUID Pool Empty");
            }
        } catch (err) {
            console.log('AuthService - appendUID', err)
            throw new Error("Failed to Append UID to Body");
        }
        return
    }

    public async authenticateUser(ctx: Context): Promise<any> {
        try {
            const authenticated = await new Promise((resolve, reject) => {
                try {
                    pwd.hash(ctx.body.password, ctx.user.salt, (err, hash) => {
                        if (err) reject(err);
                        if (ctx.user.hash && (ctx.user.hash == hash)) {
                            resolve(true);
                        }
                        resolve(false);
                    })
                } catch (err) {
                    reject(err)
                }
            })
            if (!authenticated) throw new Error("Authentication Failed");

        } catch (err) {
            console.log('AuthService - authenticateUser', err)
            throw new Error("Failed to Authenticate User Credentials");
        }
        return
    }

    public async addWalletCredentials(ctx: Context): Promise<any> {
        try {
            const { prvKeyHex, pubKeyHex } = ctx.data.credentials._key;
            ctx.update('body', { privateKey: prvKeyHex, publicKey: pubKeyHex });
        } catch (err) {
            console.log('AuthService - addWalletCredentials', err)
            throw new Error("Failed to Add Wallet Credentials to Database");
        }
        return
    }

    public async saveUser(ctx: Context): Promise<any> {
        try {
            let db = this.databaseService.DataBase;
            let collection = db!.collection('users');
            collection.createIndexes([{
                key: {
                    address: 1,
                },
                name: "address_1",
                unique: true
            }]);
            await collection.insertOne({ address: ctx.data.address });
        } catch (err) {
            console.log('AuthService - addWalletCredentials', err)
            throw new Error("Failed to Add Wallet Credentials to Database");
        }
        return
    }

    public async getUser(ctx: Context): Promise<any> {
        try {
            const db = this.databaseService.DataBase;
            const collection = db!.collection('users');
            const user = head(await collection.aggregate([
                {
                    $match: {
                        address: ctx.data.address,
                    },
                }
            ]).toArray())
            if (user) ctx.user = user;
        } catch (err) {
            console.log('AuthService - getUser', err)
            throw new Error("Failed to Get User");
        }
        return
    }

    public async saveNotificationToken(ctx: Context): Promise<any> {
        try {
            const db = this.databaseService.DataBase;
            const collection = db!.collection('users');
            await collection.updateOne({
                mobile: ctx.user.mobile,
                organization: new ObjectID(ctx.user.organization)
            }, {
                $set: {
                    notificationToken: ctx.body.notificationToken
                }
            });
        } catch (err) {
            console.log('AuthService - saveNotificationToken', err)
            throw new Error("Failed to save user notification token");
        }
    }

    public async getNotificationToken(ctx: Context): Promise<any> {
        try {
            const db = this.databaseService.DataBase;
            const collection = db!.collection('users');
            const res = await collection.findOne({
                mobile: ctx.user.mobile,
                organization: new ObjectID(ctx.user.organization)
            }, {
                projection: {
                    notificationToken: 1
                }
            });
            ctx.addData({
                notificationToken: res.notificationToken
            })
        } catch (err) {
            console.log('AuthService - saveNotificationToken', err)
            throw new Error("Failed to save user notification token");
        }
    }

    public async getNotificationTokenByUID(ctx: Context, uid: string): Promise<any> {
        const db = this.databaseService.DataBase;
        const collection = db!.collection('users');
        const res = await collection.findOne({
            uid
        }, {
            projection: {
                notificationToken: 1
            }
        });
        ctx.addData({
            notificationToken: res.notificationToken
        })
    }
}