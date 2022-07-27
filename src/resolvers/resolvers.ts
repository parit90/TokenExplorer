import { EthMethods } from "../methods/ethMethods"
import {createAlchemyWeb3} from '@alch/alchemy-web3';
import config from 'config';
import * as fs from 'fs';
import * as path from 'path';

const uri = config.get<string>('alchemy.uri') + config.get<string>('alchemy.API_KEY');
const web3 = createAlchemyWeb3(uri);

let TokenbuffData = fs.readFileSync(path.join(__dirname, '..','tokenABI.json'));
let UniswapBuffData = fs.readFileSync(path.join(__dirname,'..','uniswapV2FactoryABI.json'));

let tokenABI = JSON.parse(TokenbuffData.toString());
let uniswapABI = JSON.parse(UniswapBuffData.toString());

let EthMethod:any = EthMethods(web3, uniswapABI, tokenABI)

export const resolvers = {
    Query:{
        getTokenName: async(_:any, {address}) =>{
           const tokenName = await EthMethod.getTokenName(tokenABI, address)
           return tokenName
        },
        getTokenSymbol: async(_:any, {address}) =>{
            const tokenSymbol= await EthMethod.getTokenSymbol(tokenABI, address)
            return tokenSymbol
        },
        getTokenSupply: async(_:any, {address}) =>{
            const tokenSupply= await EthMethod.getTokenSupply(tokenABI, address)
            return tokenSupply
        },
        // getBlockNumber: async(_:any, {}) =>{
        //     const blockNum= await EthMethod.getBlockNumber()
        //     return blockNum
        // },
        getPriceEth: async(_:any, {address}) =>{
            const priceEth= await EthMethod.getPriceEth(uniswapABI,tokenABI, address)
            return priceEth
        },
        getPriceUSD: async(_:any, {address}) =>{
            const priceUsd= await EthMethod.getPriceEth(uniswapABI,tokenABI, address)
            return priceUsd
        }
    }
}