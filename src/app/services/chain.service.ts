import { Service } from "typedi";
import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { AccountId } from '@polkadot/types/interfaces';
import { ExchangableId } from '../types';
import { Keyring } from '@polkadot/api';

type OwnedExchangableIdsKey = [AccountId, Option<ExchangableId>] & Codec;

@Service()
export class ChainService {
    private api!: ApiPromise;

    public set Api(value) {
        this.api = value
    }

    public get Api(): ApiPromise {
        return this.api;
    }

    public async getLocalStorage(key: string):Promise<any> {
        await this.api.isReady;
        return await this.api.rpc.offchain.localStorageGet("PERSISTENT", `contact_tracing_ocw::${key}`);
    }
    
    public async runExtrinsics(): Promise<any> {
        await this.api.isReady;
        
    }

    public async getHex() {
        await this.api.isReady;

        const keyring = new Keyring({ type: 'sr25519' });

        // try {
        //     return this.api.tx.exchangableId.create();
        // } catch(err){
        //     console.log(err);
        // }
        //

        // let accountKey = this.api.createType('(AccountId, Option<ExchangableId>)' as any, [, null]) as OwnedExchangableIdsKey
        // console.log(await this.api.query.exchangableId.ownedExchangableIds(accountKey));
        const { nonce, data: balance } = await this.api.query.system.account('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
        return null;
    }
}
export type Api = ApiPromise | undefined;