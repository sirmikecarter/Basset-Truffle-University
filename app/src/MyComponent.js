import React, {Component}  from "react";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import BassetContract from './contracts/BassetContract.json';

import ipfs from './ipfs';
import vision from "react-cloud-vision-api";
import config from './config';
import axios from 'axios';

import getWeb3 from "@drizzle-utils/get-web3";
import getContractInstance from "@drizzle-utils/get-contract-instance";
import getAccounts from "@drizzle-utils/get-accounts";
import createCurrentAccount$ from "@drizzle-utils/current-account-stream";
import createNewBlock$ from "@drizzle-utils/new-block-stream";
import createContractCall$ from "@drizzle-utils/contract-call-stream";
import createContractState$ from "@drizzle-utils/contract-state-stream";
import {AccountData, ContractData, ContractForm,} from "drizzle-react-components";

import logo from "./logo.png";

class MyComponent extends Component {

constructor(props, context) {
      super(props)

      this.state = {
        showDiv: '',
        ipfsHash:'', ipfsHashSave:'',
        itemHash: [], itemHashSelected: '',
        files: [], itemSelectedBuffer:'', itemInvSelectedBuffer:'',
        imageResults: 'Image Results Will Show Here',
        itemCategorySelected: '',itemCategorySelectedSave: '',
        itemCategory: '', itemCategoryGuess1: [], itemCategoryGuess2: [],
        web3:'', address: '', contractInstance:'',
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleHashChange = this.handleHashChange.bind(this);
}

componentDidMount = async () => {
      const web3 = await getWeb3();
      const instance = await getContractInstance({
        web3,
        artifact: BassetContract,
      });

      this.setState({contractInstance: instance  });

      try {
          const currentAccount$ = await createCurrentAccount$({ web3 });

          currentAccount$.subscribe(currentAccount =>
            this.setState({ address: currentAccount }),
          );
          currentAccount$.subscribe(currentAccount =>
            this.grabData(),
          );
        } catch (error) {
        console.error(error);
      }
};

grabData = async () => {
      this.setState({itemHash: [] });
      this.setState({ipfsHash: '' });
      this.setState({ipfsHashSave: '' });
      this.setState({itemCategorySelected: '' });
      this.setState({itemCategorySelectedSave: '' });
      this.setState({itemInvSelectedBuffer: '' });
      this.setState({itemCategoryGuess1: [] });
      this.setState({itemSelectedBuffer: '' });
      this.setState({showDiv: null });
      this.setState({imageResults: 'Image Results Will Show Here' });

      const resultHashIndex = await this.state.contractInstance.methods.getUserItemHash(0).call({from: this.state.address})

      // using the callback
      // this.state.contractInstance.methods.getUserItemHash(0).call({from: this.state.address}, function(error, result){
      //     console.log(error)
      // });

      const itemCount = await this.state.contractInstance.methods.getUserItemCount().call({from: this.state.address})

      var itemHashArray = this.state.itemHash.slice();

      if (itemCount !== null){

        for (var i = 0; i < itemCount; i++) {
        const itemResult = await this.state.contractInstance.methods.getUserItemHash(i).call({from: this.state.address})
        //console.log(itemCount.toNumber())
        //console.log(itemResult)
        if (itemHashArray.indexOf(itemResult) === -1) {
          itemHashArray.push(itemResult);
        }
        this.setState({itemHash: itemHashArray});
        }

      }

      if (resultHashIndex !== null){
          this.setState({ipfsHash:resultHashIndex});
          this.setState({ipfsHashSave:resultHashIndex});

          const resultHashName = await this.state.contractInstance.methods.getUserItemAttributes(this.state.ipfsHash).call({from: this.state.address})

          this.setState({itemCategorySelected: resultHashName });
          this.setState({itemCategorySelectedSave: resultHashName });

        if (this.state.ipfsHash !== null){
          axios.get(`https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}`).then(res => {

          if(res.headers["content-type"] = 'image/jpeg, application/json; charset=utf-8'){
            this.setState({itemInvSelectedBuffer: `https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}` });
          }else{
            this.convertToBufferInv(res.data)
          }

          });
        }
    }
};

grabNewData = async () => {
      const web3 = await getWeb3();

      this.setState({ipfsHash:this.state.itemHashSelected });
      this.setState({ipfsHashSave:this.state.itemHashSelected});

      const resultHashName = await this.state.contractInstance.methods.getUserItemAttributes(this.state.ipfsHash).call({from: this.state.address})

      this.setState({itemCategorySelectedSave: resultHashName });

      if (this.state.ipfsHash !== null){
            axios.get(`https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}`).then(res => {
              //console.log(res)
              if(res.headers["content-type"] = 'image/jpeg, application/json; charset=utf-8'){
                this.setState({itemInvSelectedBuffer: `https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}` });
              }else{
                this.cconvertToBufferInv(res.data)
              }

            });
      }

}

setData = async () => {
      this.setState({ipfsHashSave:this.state.ipfsHash});
      this.setState({itemCategorySelectedSave:this.state.itemCategorySelected});
      this.setState({itemInvSelectedBuffer: '' });

      axios.get(`https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}`).then(res => {
        //console.log(res)
        if(res.headers["content-type"] = 'image/jpeg, application/json; charset=utf-8'){
          this.setState({itemInvSelectedBuffer: `https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}` });
        }else{
          this.convertToBufferInv(res.data)
        }

      });

      this.state.contractInstance.methods.setItem(this.state.ipfsHash,this.state.itemCategorySelected).send({from: this.state.address})

      var itemHashArray = this.state.itemHash.slice();

        if (itemHashArray.indexOf(this.state.ipfsHash) === -1) {
          itemHashArray.push(this.state.ipfsHash);
        }

        this.setState({itemHash: itemHashArray});

        this.setState({imageResults:'Complete' });

}

onSaveImageSubmit = async (event) => {
      event.preventDefault()
      this.setState({imageResults:'Waiting on IPFS..' });
      const ipfsHash = await this.pushToIPFS();

      if(ipfsHash !== null)
        {
          this.setState({ipfsHash:ipfsHash});
          this.setData();
        }
};

handleChange(event) {
      this.setState({itemCategorySelected: event.target.value});
};

handleHashChange(event) {
      this.setState({itemHashSelected: event.target.value});
      this.grabNewData();
};

usercaptureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const files = event.target.files[0]

      const reader = new FileReader()
      reader.onload = (event) => {
          //console.log(reader)
          this.convertToBufferAdd(reader)
          this.setState({files});
          this.setState({imageResults:'Image Results Pending...' });
          this.setState({itemCategoryGuess1:[] });
          this.setState({itemCategoryGuess2:[] });

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

        var itemCategoryArray1 = this.state.itemCategoryGuess1.slice();
        var itemCategoryArray2 = this.state.itemCategoryGuess2.slice();


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
              if (itemCategoryArray1.indexOf(name) === -1) {
                itemCategoryArray1.push(name);
              }
          }

        }

        for (i = 0; i < res.responses[0].labelAnnotations.length; i++) {
          var category = JSON.stringify(res.responses[0].labelAnnotations[i].description).replace(/"/g, "");
          category = category.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
          });

          if (itemCategoryArray2.indexOf(category) === -1) {
            itemCategoryArray2.push(category);
          }
        }
          itemCategoryArray1.sort();
          itemCategoryArray2.sort();

        const itemArrayCombine = [...itemCategoryArray1, ...itemCategoryArray2]; // arr3 ==> [1,2,3,3,4,5]


        this.setState({
          itemCategoryGuess1: itemArrayCombine,
          itemCategoryGuess2: itemCategoryArray2
        });

          this.setState({imageResults:'Image Results Complete' });
          this.setState({showDiv: 'showButton' });
          this.setState({itemCategorySelected: this.refs.itemCategorySelected.value });

        }, (e) => {
        console.log('Error: ', e)
        })

        };

      reader.readAsDataURL(files);
};

convertToBufferAdd = async(reader) => {
      //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer-using es6 syntax
      this.setState({itemSelectedBuffer: buffer});
};

convertToBufferInv= async(reader) => {
      //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader);
      //set this buffer-using es6 syntax
      this.setState({itemInvSelectedBuffer: buffer });
};

pushToIPFS = (e) => {
      return new Promise((resolve, reject) => {
               ipfs.add(this.state.itemSelectedBuffer, (err, ipfsHash) => {
                 if(!err){
                   resolve(ipfsHash[0].hash);
                 }else {
                   resolve('QmbyizSHLirDfZhms75tdrrdiVkaxKvbcLpXzjB5k34a31');
                 }

             })
      });
  }

render() {

      const { showDiv } = this.state

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
          <hr/>
            <h2>Select a Picture to add to your Inventory</h2>
            <form onSubmit={this.onSaveImageSubmit}>
            <p><input type = "file" onChange = {this.usercaptureFile}/></p>
         <hr/>
           { showDiv === 'showButton' && (
           <div>
             <p><button type="submit">Save Item</button></p>
               <i style={{ color: 'green' }}>(Click Save Item)</i>
               <br/>
               <i style={{ color: 'green' }}>(the Image is sent to IPFS.Infura.io and the Hash returned is saved)</i>
               <br/>
               <i style={{ color: 'green' }}>(Selected Item in the list box will will be saved)</i>
               <hr/>
               <p><img src={this.state.itemSelectedBuffer} alt="inventory" height="100" width="100" /></p>
           </div>   )}
            <strong style={{ color: 'red' }}>{this.state.imageResults}</strong>
            <p>Item Category Guess: </p>
            <ul><select required onChange={this.handleChange} value={this.state.itemCategorySelected} ref="itemCategorySelected">{this.state.itemCategoryGuess1.map(f => <option value={f}>{f}</option>)}</select></ul>
        </form>
        <hr/>
          <h2>Inventory</h2>
              <strong>Select Item: </strong>
              <ul><select onChange={this.handleHashChange} value={this.state.itemHashSelected}>{this.state.itemHash.map(f => <option value={f} key={f}>{f}</option>)}</select></ul>
              <br/>Stored Hash: <a href={'https://gateway.ipfs.io/ipfs/'+ this.state.ipfsHashSave} target="_blank" rel="noopener noreferrer">{this.state.ipfsHashSave}</a>
            <p><img src={this.state.itemInvSelectedBuffer} alt="inventory" height="100" width="100" /></p>
            <p>
              <strong>Stored Category: </strong>

              {this.state.itemCategorySelectedSave}
            </p>
            <hr/>
            <div className="section">
            <strong>Update Stored Name Manually (Only if _storedHash Exists): </strong>
                <ContractForm contract="BassetContract" method="setUseritemCategory" />
              </div>
          </div>
          <div className="App">
            <ToastContainer />
          </div>
        </div>

); }}

export default MyComponent;
