import { Service } from "typedi";
import * as request from 'request';
import * as _ from 'lodash';
import { get } from 'config';
import { log } from 'winston';
import * as path from 'path';
import * as process from 'process';
import * as admin from 'firebase-admin';
import { Context } from "../model";

@Service()
export class MessagingService {
    constructor() {

    }

    public async sendPushNotification(ctx: Context): Promise<any> {
        try {
            const messaging = admin.messaging();
            const { title, body, data } = ctx.data.notification;
            const payload: any = {
                notification: { title, body, click_action: "FLUTTER_NOTIFICATION_CLICK" }
            }
            if (data) payload.data = data;
            let res = await messaging.sendToDevice(ctx.data.notificationToken, {
                ...payload
            });
        } catch (err) {
            console.error('TokenService - createJWTToken', err)
            throw new Error("Failed to create JWT Token");
        }
        return;
    }
}