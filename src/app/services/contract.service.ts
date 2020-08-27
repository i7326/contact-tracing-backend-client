import { Service } from "typedi";
import { Context } from '../model/Context';
import { find, isUndefined, lowerCase, head } from 'lodash';
import { Gateway } from 'fabric-network';

@Service()
export class ContractService {

    public async runContract(ctx: Context): Promise<any> {
        try {
            const { configuration, wallet } = ctx.data;
            const { uid, organization } = ctx.user;
            const contractConfig = organization.contracts[ctx.data.contractName];
            const gateway = new Gateway();
            await gateway.connect(configuration, { wallet, identity: uid, discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork(contractConfig.channel);
            const contract = network.getContract(contractConfig.name);
            await contract.submitTransaction(ctx.data.contractFunc, ctx.data.contractArgs);
            await gateway.disconnect();
        } catch (err) {
            console.error('ContractService - runContract', err)
            throw new Error("Failed to Execute Contract");
        }
        return
    }

    public async evaluateContract(ctx: Context): Promise<any> {
        try {
            const { configuration, wallet } = ctx.data;
            const { uid, organization } = ctx.user;
            const contractConfig = organization.contracts[ctx.data.contractName];
            const gateway = new Gateway();
            await gateway.connect(configuration, { wallet, identity: uid, discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork(contractConfig.channel);
            const contract = network.getContract(contractConfig.name);
            const result = await contract.evaluateTransaction(ctx.data.contractFunc, ctx.data.contractArgs);
            ctx.addData({
                result
            })
            await gateway.disconnect();
        } catch (err) {
            console.error('ContractService - runContract', err)
            throw new Error("Failed to Execute Contract");
        }
        return
    }

    public async getContract(ctx: Context): Promise<any> {
        try {
            const { configuration, wallet } = ctx.data;
            const { organization } = ctx.user;
            const contractConfig = organization.contracts['contact_track'];
            const gateway = new Gateway();
            await gateway.connect(configuration, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork(contractConfig.channel);
            const contract = network.getContract(contractConfig.name);
            ctx.addData({
                contract
            })
        } catch (err) {
            console.error('ContractService - contractGateway', err)
            throw new Error("Failed to Initiate Contract Connection");
        }
        return
    }

}