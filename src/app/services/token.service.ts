import { verify, sign } from 'jsonwebtoken';
import { Service } from "typedi";
import { get } from 'config';
import { pick } from 'lodash';
import * as pwd from 'pwd';
import { Context } from '../model';

@Service()
export class TokenService {

    public async verifyJWTToken(ctx: Context): Promise<any> {
        try {
            const secret = get("token.secret");
            const authorization = ctx.headers.authorization;
            if (!authorization) throw new Error("No Authorization Found");
            let token = authorization.split(" ")[1];
            ctx.user = await new Promise((resolve, reject) => {
                verify(token, <string>secret, (err, decode) => {
                    if (decode !== undefined) resolve(decode);
                    reject("Invalid token");
                })
            })
        } catch (err) {
            console.error('TokenService - verifyJWTToken', err)
            throw new Error("Failed to verify JWT Token");
        }
        return
    }

    public createJWTToken(ctx: Context, type: string) {
        try {
            let tokenSchema: {
                expiry: string,
                payload: string[]
            } = get(`token.${type}`);
            let payload = pick(ctx.body, ...tokenSchema.payload);
            const expiresIn = tokenSchema.expiry;
            ctx.addData({
                token: sign(payload, get("token.secret"), {
                    expiresIn
                })
            })
        } catch (err) {
            console.error('TokenService - createJWTToken', err)
            throw new Error("Failed to create JWT Token");
        }
        return
    }


}