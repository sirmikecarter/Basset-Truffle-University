import SimpleStorage from "./contracts/SimpleStorage.json";
import ComplexStorage from "./contracts/ComplexStorage.json";
import TutorialToken from "./contracts/TutorialToken.json";
import BassetContract from "./contracts/BassetContract.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
  contracts: [SimpleStorage, ComplexStorage, TutorialToken, BassetContract],
  events: {
    SimpleStorage: ["StorageSet"],
    BassetContract: ["StorageSet"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
