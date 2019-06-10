const path = require("path");
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API = process.env.INFURA_API;

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  // networks: {
  //   ropsten: {
  //     provider: function() {
  //       return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/"+INFURA_API);
  //     },
  //     network_id: '3',
  //   },
  //   test: {
  //     provider: function() {
  //       return new HDWalletProvider(MNEMONIC, "http://127.0.0.1:9545/");
  //     },
  //     network_id: '*',
  //   },
  // }
};
