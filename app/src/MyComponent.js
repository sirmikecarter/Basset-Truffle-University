import React, {Component} from "react";

import {AccountData, ContractData, ContractForm,} from "drizzle-react-components";

import BassetContract from './contracts/BassetContract.json';
import logo from "./logo.png";
import ipfs from './ipfs';
import vision from "react-cloud-vision-api";
import config from './config';
import getWeb3 from './getWeb3'
const contract = require('truffle-contract')


class MyComponent extends Component {

constructor(props, context) {
  super(props)

  this.state = {
    ipfsHash:"None",
    web3:null,
    buffer:'',
    ethAddress:'',
    transactionHash:'',
    txReceipt: '',
    ImageResults: 'Results Will Show Here',
    files: [], itemName: '', itemNameGuess: [], itemCategory: [],  itemCategoryGuess: [], imagePreview: ''
  };
//console.log(this.props.BassetContract)
  //this.contracts = context.drizzle.contracts
}

  componentWillMount() {
      getWeb3
      .then(results => {
        this.setState({web3: results.web3})

        const contractOperator = contract(BassetContract)
        var contractOperatorInstance
        contractOperator.setProvider(this.state.web3.currentProvider)

        this.state.web3.eth.getAccounts((error, accounts) => {
          contractOperator.deployed().then((instance) => {
            contractOperatorInstance = instance
            return contractOperatorInstance.storedHash.call({from: this.props.accounts[0]})
          }).then((result) => {
            //console.log(result)
            this.setState({ipfsHash:result });
          })
        })

      })
      .catch(() => {
        console.log('Error finding web3.')
      })
    }

    usercaptureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const files = event.target.files[0]



      const reader = new FileReader()
      reader.onload = (event) => {
        this.convertToBuffer(reader)
        this.setState({files});
        this.setState({ImageResults:'Results Pending...' });
        this.setState({itemNameGuess:[] });
        this.setState({itemCategoryGuess:[] });


      //this.setState({imagePreview: files[0].preview});

      vision.init({ auth: config.googleVision})

      const req = new vision.Request({
        image: new vision.Image({
          base64: event.target.result,
      }),
        features: [
          new vision.Feature('WEB_DETECTION', 10),
          new vision.Feature('LABEL_DETECTION', 10),
      //new vision.Feature('TEXT_DETECTION', 10),
        ]
      })
      // send single request
      vision.annotate(req).then((res) => {
      // handling response

      var itemNameArray = this.state.itemNameGuess.slice();
      var itemCategoryArray = this.state.itemCategoryGuess.slice();


      // for (var i = 0; i < res.responses[0].webDetection.pagesWithMatchingImages.length; i++) {
      //
      //   console.log(res.responses[0].webDetection.pagesWithMatchingImages[i].url)
      //
      // }


      for (var i = 0; i < res.responses[0].webDetection.webEntities.length; i++) {
        if (res.responses[0].webDetection.webEntities[i].description !== undefined)
          {
            var name = JSON.stringify(res.responses[0].webDetection.webEntities[i].description).replace(/"/g, "");
            name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
              return letter.toUpperCase();
          });
            if (itemNameArray.indexOf(name) === -1) {
              itemNameArray.push(name);
            }
        }

      }

      for (i = 0; i < res.responses[0].labelAnnotations.length; i++) {
        var category = JSON.stringify(res.responses[0].labelAnnotations[i].description).replace(/"/g, "");
        category = category.toLowerCase().replace(/\b[a-z]/g, function(letter) {
          return letter.toUpperCase();
        });

        if (itemCategoryArray.indexOf(category) === -1) {
          itemCategoryArray.push(category);
        }
      }
        itemNameArray.sort();
        itemCategoryArray.sort();


      this.setState({
      itemNameGuess: itemNameArray,
      itemCategoryGuess: itemCategoryArray
      });

      console.log(this.state.itemNameGuess)
      console.log(this.state.itemCategoryGuess)
      this.setState({ImageResults:'Results Complete' });



      }, (e) => {
      console.log('Error: ', e)
      })


      };

      reader.readAsDataURL(files);

    };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer-using es6 syntax
      this.setState({buffer});
    };

    onSubmit = async (event) => {
      event.preventDefault()

    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        //console.log(err,ipfsHash);
        const contractOperator = contract(BassetContract)
        var contractOperatorInstance
        contractOperator.setProvider(this.state.web3.currentProvider)

        this.state.web3.eth.getAccounts((error, accounts) => {
          contractOperator.deployed().then((instance) => {
            contractOperatorInstance = instance
            return contractOperatorInstance.setItem(ipfsHash[0].hash,this.state.itemNameGuess[0], {from: this.props.accounts[0]})
          }).then((result) => {
            console.log(result)
            this.setState({ipfsHash:ipfsHash[0].hash });
          })
        })

        })
      };

  render() {

    return (

      <div className="App">
        <div>
          <img src={logo} alt="drizzle-logo" />
          <h1>BlockchainAsset.me</h1>
          <p>Home Inventory DaPP - Keep track of your Stuff!</p>
        </div>
        <div className="section">
          <h2>Active Account</h2>
          <AccountData accountIndex="0" units="ether" precision="3" />
        </div>
        <div className="section">
          <h2>Select a Picture to add to your Inventory</h2>
          <form onSubmit={this.onSubmit}>
          <p><input type = "file" onChange = {this.usercaptureFile}/></p>
       <hr/>
          <strong>{this.state.ImageResults}</strong>
          <p>Name Guess #1: </p>
          <ul>{this.state.itemNameGuess.map(f => <li key={f}>{f}</li>)}</ul>
          <p>Name Guess #2: </p>
          <ul>{this.state.itemCategoryGuess.map(f => <li key={f}>{f}</li>)}</ul>
       <hr/>
          <p><button type="submit">Save Item</button></p>
            <i>(first item in Name Guess #1 will be added to the blockchain)</i>
            <br/>
            <i>(need to add the ability for the user to pick a Name of the item)</i>      
          </form>
      <hr/>
        <h2>Blockchain Data</h2>
          <p>
            <strong>Stored Hash: </strong>
            <ContractData contract="BassetContract" method="storedHash"  />
            <br/>Hash Link: <a href={'https://gateway.ipfs.io/ipfs/'+ this.state.ipfsHash} target="_blank" rel="noopener noreferrer">{this.state.ipfsHash}</a>
          </p>
          <p>
            <strong>Stored Name: </strong>
            <ContractData contract="BassetContract" method="storedName"  />
          </p>
          <hr/>
          <strong>Update Fields Manually: </strong>
          <ContractForm contract="BassetContract" method="setItem" />
        </div>
      </div>
  ); }} export default MyComponent;
