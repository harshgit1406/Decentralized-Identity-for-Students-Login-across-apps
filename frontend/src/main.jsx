import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";

const wallets = [new PetraWallet()];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider 
      plugins={wallets} 
      autoConnect={true}
      dappConfig={{ network: Network.DEVNET }}
    >
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);