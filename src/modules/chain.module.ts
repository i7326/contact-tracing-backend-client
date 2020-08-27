import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import micro from 'micro';
import { Container } from 'typedi';
import { router } from 'microrouter';
import { DiscoveryController } from '../app/controllers';
import { get } from 'config';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ChainService } from '../app/services';

export const ChainModule: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const wsProvider = new WsProvider('ws://127.0.0.1:9944');
        Container.get(ChainService).Api = await ApiPromise.create({
            provider: wsProvider,
            types: {
                "Address": "AccountId",
                "LookupSource": "AccountId",
                "ExchangableIdIndex": "u32",
                "ExchangableId": "Hash",
                "UUID": "Text",
                "ExchangableIdLinkedItem": {
                    "prev": "Option<ExchangableId>",
                    "next": "Option<ExchangableId>"
                }
            }
        });
    }
};
