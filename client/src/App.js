import "./App.css";
import Routers from "./Routers";
import { createContext, useState } from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ChatUIProvider } from "@pushprotocol/uiweb";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { Analytics } from "@vercel/analytics/react";

export const UserContext = createContext();
// export const backendUrl = "https://comebackbuilding.onrender.com";
export const backendUrl = "http://localhost:3001";
// export const backendUrl = "https://comebackbuilding.onrender.com";
function App() {
  const [users, setUsers] = useState({});
  const [githubData, setGithubData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserMessageList, setCurrentUserMessageList] = useState([]);
  const [authToken, setAuthToken] = useState("");
  const [signer, setSinger] = useState({});
  const [currentChat, setCurrentChat] = useState();
  const [walletAddress, setWalletAddress] = useState("");
  const [recommendedUsers, setRecommendedUsers] = useState({});
  const smartWalletConfig = {
    factoryAddress: "0x4ab5be853ec33ef1b73ef4d7cdd24db2639e12b7",
    gasless: true,
    isHeadless: true,
  };

  const locale = {
    en: {
      dyn_widget: {
        connect: "Click to Join!",
      },
      dyn_collect_user_data: {
        description: "Login with your github to find your tech mates!",
      }
    }
  }

  const cssOverrides = `
  .account-control__name {
    font-size: 0;
  }
  .account-control__name:before {
    content: "Click to Join!";
    font-size: 0.9rrem;
  }
  `

  return (
    <DynamicContextProvider
      settings={{
        cssOverrides: cssOverrides,
        environmentId: '245acb35-2772-4c07-91bb-7a1f6a4d8d98',
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
        eventsCallbacks: {
          // onAuthSuccess: (args) => {
          //   setAuthToken(args.authToken);
          //   // console.log(args.authToken, "authToken");
          //   localStorage.setItem("dynamic_authentication_token", args.authToken);
          // },
          onLogout: () => {
            setCurrentUser({});
          }
        }
      }}
      locale={locale}
      >
      <UserContext.Provider
        value={{
          users,
          setUsers,
          currentUser,
          setCurrentUser,
          currentUserMessageList,
          setCurrentUserMessageList,
          authToken, setAuthToken,
          signer, setSinger,
          currentChat, setCurrentChat,
          walletAddress, setWalletAddress,
          recommendedUsers, setRecommendedUsers
        }}
      >
        <Analytics />
        <Routers />
      </UserContext.Provider>
    </DynamicContextProvider>
  );
}

export default App;
