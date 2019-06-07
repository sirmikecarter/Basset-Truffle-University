import React, {Component} from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";

import logo from "./logo.png";

import ipfs from './ipfs';

class MyComponent extends Component {

  state = {
    ipfsHash:null,
    buffer:'',
    ethAddress:'',
    transactionHash:'',
    txReceipt: ''
  };

  componentWillMount() {
      console.log(this.props.accounts)
    }

    usercaptureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)
    };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer-using es6 syntax
      this.setState({buffer});

    };




    onSubmit = async (event) => {
      event.preventDefault();

      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash

        //call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
        //return the transaction hash from the ethereum contract
        ContractData.BassetContract.methods.setHash(ipfsHash[0].hash).send({
          from: this.props.accounts[0]}, (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({ ipfsHash:ipfsHash[0].hash });
            this.setState({transactionHash});
          });
        })
      };





  render() {

    return (

      <div className="App">
        <div>
          <img src={logo} alt="drizzle-logo" />
          <h1>Drizzle Examples</h1>
          <p>Examples of how to get started with Drizzle in various situations.</p>
        </div>

        <div className="section">
          <h2>Active Account</h2>
          <AccountData accountIndex="0" units="ether" precision="3" />
        </div>

        <div className="section">
          <h2>Set Item</h2>
          <p>
            This shows a simple ContractData component with no arguments, along with
            a form to set its value.
          </p>
          <h3>Select a Picture to add to your Inventory</h3>
          <form onSubmit={this.onSubmit}>
          <input type = "file" onChange = {this.usercaptureFile}/>
          <button bsStyle="primary" type="submit"> Send it </button>
           </form><hr/>
          <p>
            <strong>Stored Value: </strong>
            <ContractData contract="BassetContract" method="storedData" />
          </p>
          <ContractForm contract="BassetContract" method="setItem" />
        </div>

        <div className="section">
          <h2>SimpleStorage</h2>
          <p>
            This shows a simple ContractData component with no arguments, along with
            a form to set its value.
          </p>
          <p>
            <strong>Stored Value: </strong>
            <ContractData contract="SimpleStorage" method="storedData" />
          </p>
          <ContractForm contract="SimpleStorage" method="set" />
        </div>

        <div className="section">
          <h2>TutorialToken</h2>
          <p>
            Here we have a form with custom, friendly labels. Also note the token
            symbol will not display a loading indicator. We've suppressed it with
            the <code>hideIndicator</code> prop because we know this variable is
            constant.
          </p>
          <p>
            <strong>Total Supply: </strong>
            <ContractData
              contract="TutorialToken"
              method="totalSupply"
              methodArgs={[{ from: this.props.accounts[0] }]}
            />{" "}
            <ContractData contract="TutorialToken" method="symbol" hideIndicator />
          </p>
          <p>
            <strong>My Balance: </strong>
            <ContractData
              contract="TutorialToken"
              method="balanceOf"
              methodArgs={[this.props.accounts[0]]}
            />
          </p>
          <h3>Send Tokens</h3>
          <ContractForm
            contract="TutorialToken"
            method="transfer"
            labels={["To Address", "Amount to Send"]}
          />
        </div>
        <div className="section">
          <h2>ComplexStorage</h2>
          <p>
            Finally this contract shows data types with additional considerations.
            Note in the code the strings below are converted from bytes to UTF-8
            strings and the device data struct is iterated as a list.
          </p>
          <p>
            <strong>String 1: </strong>
            <ContractData contract="ComplexStorage" method="string1" toUtf8 />
          </p>
          <p>
            <strong>String 2: </strong>
            <ContractData contract="ComplexStorage" method="string2" toUtf8 />
          </p>
          <strong>Single Device Data: </strong>
          <ContractData contract="ComplexStorage" method="singleDD" />
        </div>
      </div>
  ); }} export default MyComponent;
