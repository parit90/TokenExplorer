import * as fs from 'fs';
import * as path from 'path';
import {createAlchemyWeb3} from '@alch/alchemy-web3';
import config from 'config';

const uri = config.get<string>('alchemy.uri') + config.get<string>('alchemy.API_KEY');
console.log(uri)
const web3 = createAlchemyWeb3(uri);

const getBlockNumber = async () => {
  const blockNumber = await web3.eth.getBlockNumber();
  return blockNumber;
};

const getTokenName = async (tokenABI: any, address: string) => {
    const tokenContract = new web3.eth.Contract(tokenABI, address);
    return tokenContract.methods.name().call()
}

const getTokenSupply = async (tokenABI: any, address: string) => {
  const tokenContract = new web3.eth.Contract(tokenABI, address);
  return tokenContract.methods.totalSupply().call()
};

const getTokenSymbol = async (tokenABI: any, address: string) => {
  const tokenContract = new web3.eth.Contract(tokenABI, address);
  return tokenContract.methods.symbol().call()
};

//get price from uniswap, from liquidity pool
const getPriceEth = async(uniswapABI:any, tokenABI: any, address: string) => {
  const addressWETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  const addressUniswapFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  const uniswapV2FactoryContract = new web3.eth.Contract(uniswapABI, addressUniswapFactory)
  let pool = await uniswapV2FactoryContract.methods.getPair(address, addressWETH).call()
  
  let contractToken = new web3.eth.Contract(tokenABI, address)
  let contractWeth = new web3.eth.Contract(tokenABI, addressWETH)

  let tokenBalance = await contractToken.methods.balanceOf(pool).call()
  let WethBalance = await contractWeth.methods.balanceOf(pool).call()

  let WethDecimal = await contractWeth.methods.decimals().call()
  
  tokenBalance = tokenBalance/ Math.pow(10,18)
  WethBalance = WethBalance/ Math.pow(10,WethDecimal)
  console.log(tokenBalance, WethBalance)

  let oneEthToToken = tokenBalance/WethBalance
  console.log("oneEthToToken = ",oneEthToToken)
  let oneTokenToEth = 1/(tokenBalance/WethBalance)
  console.log("oneTokenToEth = ",oneTokenToEth)
  return oneTokenToEth
}

const getPriceUSD = async(address: string) =>{

}

const main = async () => {
  let TokenbuffData = fs.readFileSync(path.join(__dirname,'tokenABI.json'));
  let UniswapBuffData = fs.readFileSync(path.join(__dirname,'uniswapV2FactoryABI.json'));

  let tokenABI = JSON.parse(TokenbuffData.toString());
  let uniswapABI = JSON.parse(UniswapBuffData.toString());

  const blockNum = await getBlockNumber();
  console.log(blockNum);
  await getTokenName(tokenABI, "0x514910771AF9Ca656af840dff83E8264EcF986CA")
  await getTokenSupply(tokenABI, "0x514910771AF9Ca656af840dff83E8264EcF986CA")
  let res = await getTokenSymbol(tokenABI, "0x514910771AF9Ca656af840dff83E8264EcF986CA")
  await getPriceEth(uniswapABI, tokenABI, "0x514910771AF9Ca656af840dff83E8264EcF986CA")
  
};

main();


//cmd + space -> spotlight search