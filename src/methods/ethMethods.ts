export const EthMethods = (web3: any, uniswapABI:any, tokenABI:any) =>{
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
        return oneEthToToken
      }
      
      //pool USDC, WETH
      const getPriceUSD = async(uniswapABI:any, tokenABI:any, address: string) =>{
        let usdcAddr = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        let priceEth = await getPriceEth(uniswapABI, tokenABI, usdcAddr)
        let priceToken = await getPriceEth(uniswapABI, tokenABI, address)
      
        priceEth = 1/priceEth
        let price = priceToken * priceEth;
        return price;
      
      }

      return {
        getBlockNumber:getBlockNumber,
        getTokenName:getTokenName,
        getTokenSupply:getTokenSupply,
        getTokenSymbol:getTokenSymbol,
        getPriceEth:getPriceEth,
        getPriceUSD:getPriceUSD
      }
      
}