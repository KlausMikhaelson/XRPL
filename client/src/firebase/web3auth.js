import { Web3Auth } from "@web3auth/modal";

// Initialize within useEffect()
const web3auth = new Web3Auth({
  clientId: "BLQxubgOU9-1HKI7hDHFf3fL0gP63h7MWhD2IlAtefIjtMQ2hJ107Lk8V7Kk2jCG5A6k86PoTT6szkGc9s74c3w", // Get your Client ID from the Web3Auth Dashboard
  web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x89",
    rpcTarget: "https://rpc.ankr.com/polygon",
    displayName: "Polygon Mainnet",
    blockExplorer: "https://polygon.etherscan.io",
    ticker: "MATIC",
    tickerName: "Polygon",
  },
});

await web3auth.initModal();