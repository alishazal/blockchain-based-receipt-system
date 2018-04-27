import sha256 from 'crypto-js/sha256';
import crypto from 'crypto-js';
import React, { Component } from 'react';
import Radium from 'radium';
import './Issue.css';
import web3 from 'web3';
import controller from '../contractController.js';
import Status from './Status.js';

//@Radium
class IssueComponent extends Component {

	state = {
		hash: "",
		status: ""
	};

	constructor(props) {
		super(props);
		this.dropHandler = this.dropHandler.bind(this);
		this.issueReceipt = this.issueReceipt.bind(this);
	}

	dropHandler(e) {
		e.preventDefault();
		console.log("File dropped");

		var file = e.dataTransfer.files[0];
		var reader = new FileReader();

		reader.onload = (e) => {
			var binary = e.target.result;
			var hash = sha256(binary);
			hash = hash.toString(crypto.enc.Base64);
			console.log(hash);
			this.setState({hash: hash});
		};

		reader.readAsBinaryString(file);
	}

	async issueReceipt() {
		try {
			await controller.issueReceipt(this.state.hash, this.props.account);
			this.setState({status: "Receipt issued!"});
		} catch(e) {
			console.log(e);
			this.setState({status: "Failed to issue receipt."});
		}
	}


	render() {
		return (
			<div className="IssueComponent">
				<h>Issue Interface</h>
				<Status status = {this.state.status} />
				<p>Welcome{ !this.props.insName ? "" :
					", " + this.props.insName}!</p>
				{ !this.props.account ? "" : 
					<p>Your account: {this.props.account} </p>}
				<div id="holder" 
					onDrop = {this.dropHandler}
					onDragOver = {(e)=>{e.preventDefault();}}
					onDragEnd = {(e)=>{return false;}}
				> Drag and drop the receipt file here </div>
				{
					this.state.hash === "" ? 
					"" : <p>Receipt hash: {this.state.hash} </p>
				}
				<button onClick={this.issueReceipt}>Issue Receipt</button>
			</div>
		);
	}
}

export default IssueComponent;