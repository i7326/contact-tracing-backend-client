import { u32, Bytes, Struct, Option, Text,  } from '@polkadot/types';
import { AccountId, AccountIndex, Balance, BalanceOf, BlockNumber, ExtrinsicsWeight, Hash, KeyTypeId, Moment, OpaqueCall, Perbill, Releases, ValidatorId } from '@polkadot/types/interfaces/runtime';
export interface ExchangableId extends Hash {

}

// export interface KittyLinkedItem extends Struct {
//     prev: Option<KittyIndex>;
//     next: Option<KittyIndex>;
//   }