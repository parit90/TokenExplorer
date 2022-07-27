import express from 'express'
import {importSchema} from 'graphql-import'
import {ApolloServer} from 'apollo-server'
import {resolvers} from './resolvers/resolvers'


const initServer = async() => {
 
  const typeDefs = importSchema(path.join(__dirname, "schema.graphql"))
  const server = new ApolloServer({
    typeDefs, 
    resolvers
  })

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}



const main = async () => {
  await initServer()

  // const chainLinkAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
  // // for getPriceEth from uniswap v3 smart contract pool
  // //const AAVEAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"

  // const blockNum = await EthMethod.getBlockNumber();
  // console.log(blockNum)
};

main();