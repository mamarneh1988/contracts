import React, { Component } from "react";
import SimpleStorageContract from "./contracts/ContractReg.json";
import getWeb3 from "./getWeb3";

import "./App.css";

import ipfs from './ipfs';

import bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import parse from 'html-react-parser';




class App extends Component {
  state = { htmlTable: '', htmlBody: '', imageHash: null, buffer: null, storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChanges = async (event) => {

    let nam = event.target.name;
    let val = event.target.value;
    console.log("name" + nam);
    console.log("val" + val);
    this.setState({
      [nam]: val
    });
  }

  capturefile = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      console.log("buffer", Buffer(reader.result));
      this.setState({ buffer: Buffer(reader.result) })
    }

  }
  getAllContracts = async (event) => {

    event.preventDefault();
    const { accounts, contract } = this.state;
    let contCount = await contract.methods.contractCounter().call();

    let html_table = '';

    for (let i = 1; i <= contCount; i++) {

      let res = await contract.methods.contracts(i).call();

      html_table = html_table + '<tr><td>' + res[0] + '</td><td>'
        + res[1] + '</td><td>'
        + res[2] + '</td><td>'
        + res[3] + '</td><td>'
        + res[4] + '</td><td>'
        + res[5] + '</td><td>'
        + res[6] + '</td><td>'
        + res[7] + '</td><td><img = src="https://ipfs.infura-ipfs.io/ipfs/'
        + res[8] + '"></td></tr>';

    }

    this.setState({ htmlTable: html_table });
  }
  getContracts = async (event) => {

    event.preventDefault();
    const { accounts, contract } = this.state;
    let res = await contract.methods.getContractByID(this.state.contract_id).call();
    let contCount = await contract.methods.contractCounter().call();
    let html_body = '<ul className="list-group">';

    for (let i = 0; i < 8; i++) {
      html_body = html_body + '<li className="list-group-item">' + res[i] + '</li>';

    }
    html_body = html_body + '</ul>';
    html_body = html_body + '<img = src="https://ipfs.infura-ipfs.io/ipfs/' + res[6] + '" height=200 width=200>'

    this.setState({ htmlBody: html_body })
    console.log(html_body);
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;

    ipfs.add(this.state.buffer, async (error, resutls) => {
      console.log('ipfs results', resutls);
      const temp = resutls[0].hash;
      this.setState({ imageHash: temp });
      await contract.methods.createContract(
        this.state.contractid,//  uint256 _id,
        this.state.ownername,//  string memory _ownerName,
        this.state.contractdesc,//  string memory _contDesc,
        this.state.contracttype,// uint256 _contType,
        this.state.startdate,// string memory _startDate,
        this.state.enddate,//string memory _endDate,
        this.state.municipalities,// string memory _municililaty,
        this.state.imageHash// string memory _imageHash

      ).send({ from: accounts[0] });

    });






  }
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>Welcome to the second use case session!</h1>
              <div className="form-group">

                <form onSubmit={this.handleSubmit}>

                  <label htmlFor="contractid">Contract ID</label>
                  <input className="form-control" name="contractid" placeholder="contractid" onChange={this.handleInputChanges}  ></input>
                  <label htmlFor="ownername">Owner Name</label>
                  <input className="form-control" name="ownername" placeholder="Owner Name" onChange={this.handleInputChanges}  ></input>
                  <label htmlFor="contractdesc">Contract Description</label>
                  <input className="form-control" name="contractdesc" placeholder="Contract Description" onChange={this.handleInputChanges}   ></input>

                  <label htmlFor="contracttype" >Contract Type</label>
                  <select className="form-control" name="contracttype" onChange={this.handleInputChanges} >
                    <option value="1">Land Contract</option>
                    <option value="2">Home Contract</option>
                    <option value="3">Shop Contract</option>
                    <option value="4">Building Contract</option>
                  </select>

                  <label htmlFor="municipalities">Municipality</label>

                  <select className="form-control" name="municipalities" onChange={this.handleInputChanges}  >
                    <option value="1">Khan Younes</option>
                    <option value="2">Deir Al Balah</option>
                    <option value="3">Gaza</option>
                    <option value="4">Rafah</option>
                    <option value="5">Jenin</option>
                    <option value="6">Nablus</option>
                    <option value="7">Jerusalem</option>
                    <option value="8">Haifa</option>
                    <option value="9">Acre</option>
                  </select>

                  <label htmlFor="startdate">Start Date</label>
                  <input className="form-control" name="startdate" placeholder="Start Date " onChange={this.handleInputChanges}   ></input>

                  <label htmlFor="enddate">End Date</label>
                  <input className="form-control" name="enddate" placeholder="End Date" onChange={this.handleInputChanges}  ></input>

                  <label htmlFor="contractimage">Contract Image</label>
                  <input type="file" className="form-control" name="contractimage" placeholder="Contract Image" onChange={this.capturefile}  ></input>

                  <input type="submit" className="btn btn-primary"  ></input>
                </form>
              </div>

            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="result">
              <h1>Enter the contract ID to display its information</h1>
              <form>
                <label htmlFor="contract_id">Contract ID</label>
                <input type="number" className="form-control" name="contract_id" placeholder="Contract ID" onChange={this.handleInputChanges}  ></input>

              </form>

              <button className="btn btn-primary" onClick={this.getContracts}>get contracts</button>
              <p>{parse(this.state.htmlBody)}</p>
            </div>
          </div>
        </div>
        <div className="container">

          <div className="row">
            <div className="result">
            <h1>Click the button to display all the stored contracts</h1>

              <button className="btn btn-primary" onClick={this.getAllContracts}>list all contracts</button>
              <table>
                <thead></thead>
                <tr><th>ID</th>
                  <th> Owner Name</th>
                  <th>Contract Type</th>
                  <th>Address</th>
                  <th>Municipality</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Contract Description</th>
                  <th>Image</th></tr>
                <tbody>
                  {parse(this.state.htmlTable)}
                </tbody>

              </table>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
