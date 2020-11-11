// importing the ethers.js library
const ethers = require('ethers');
// importing hyperapp
import { h, app } from "hyperapp";
// Create a wallet object with privateKey and address attributes with a default state set to null.
const state = {
  wallet: {
    privateKey: null,
    address: null
  }
}
// Create a generateWallet action in wallet, that calls the ethers.js library wallet.createRandom() method and returns a newly created privateKey and address. Set the created privateKey and address to the app state.
const actions = {
  wallet: {
    generateWallet: () => state => {
      const wallet = ethers.Wallet.createRandom();
      return {
        privateKey: wallet.privateKey,
        address: wallet.address
      };
    },
  },
};
// Displays the wallet address and privateKey states.
// Create a button that calls the generateWallet action.
const view = (state, actions) => (
  <div>
    <h1>Address:{state.wallet.address}</h1>
    <h1>Private Key:{state.wallet.privateKey}</h1>
    <button onclick={() => actions.wallet.generateWallet()}>
      Generate Wallet
    </button>
  </div>
);
app(state, actions, view, document.body)