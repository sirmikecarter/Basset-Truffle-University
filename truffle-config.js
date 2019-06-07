const path = require("path");
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.ROPSTEN_URL);
      },
      network_id: '3',
    },
    test: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:9545/");
      },
      network_id: '*',
    },
  }

};
