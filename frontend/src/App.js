import {useState} from 'react'
import logo from './logo.svg';
import './App.css';
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

const [provider, setProvider] = useState();
const [library, setLibrary] = useState();

export const providerOptions = {
 
 coinbasewallet: {
   package: CoinbaseWalletSDK, 
   options: {
     appName: "NFTx",
     infuraId: process.env.INFURA_KEY 
   }
 },
//  walletconnect: {
//    package: WalletConnect, 
//    options: {
//      infuraId: process.env.INFURA_KEY 
//    }
//  }
};
const web3Modal = new Web3Modal({
  providerOptions // required
});

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      setProvider(provider);
      setLibrary(library);
    } catch (error) {
      console.error(error);
    }
  };




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
