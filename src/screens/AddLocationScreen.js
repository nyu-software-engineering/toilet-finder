<<<<<<< Updated upstream
import React, { Component } from 'react';
import {
	View,
	Text,
<<<<<<< Updated upstream
	StyleSheet
} from 'react-native';

class AddLocationScreen extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text>AddLocationScreen</Text>
=======
	StyleSheet,
	TextInput,
	Button,
	CheckBox
} from 'react-native';
import { Constants, MapView, Location, Permissions} from 'expo';

var AWS = require('aws-sdk')

//Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
var creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: 'us-east-1:e7994f82-231f-43db-9a9b-e1868280592f',
});

AWS.config.credentials = creds;

//database connection
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});


//Adds a location to dynamodb using given data passed in 
function addLocationToDynamo(state) {

	/* 
		parameters to be entered into the database

		TableName = the name of the dynamodb database (do not change this)
		Item = the attributes (columns) and their data
			long_lat (required) = the partition key to uniquely identify the location 
			spec_type (required) = the sort key to group data entries by location, tags, or reviews
				these are hard-coded into the object being passed in already
			name, longitude and latitude all come from the user
	*/
	var params = {
		TableName: "toilets",
		Item: {
			"long_lat": longLatToString(state.location['coords']['longitude'], state.location['coords']['latitude']),
			"spec_type": state.loc,
			"name": state.name,
			"longitude": state.location['coords']['longitude'],
			"latitude": state.location['coords']['latitude'],
			"unisex": state.unisex,
			"disabled": state.disabled,
			"baby": state.baby,
			"paytouse": state.paytouse,
			"upvote": state.upvote,
			"downvote": state.downvote
		}
	}

	//sending data to the database
	ddb.put(params, function(err, data) {
	  if (err) {
	    console.log("Error", err.code, err.message);
	  } else {
	    console.log("Data has been entered into ", data.TableNames);
	  }
	});
}

//Randomizer function to call when generating primary key
function randomizer(){
	let val = Math.floor(Math.random() * Math.floor(10));
	val = val.toString();
	return val;
}

function addKey(str){
	//Should randomize more after discussing with the team
	let add = "-";
	add = add.concat(randomizer());
	let key = str.concat(add);
	return key;
}

function longLatToString(long, lat) {
	var longString = long.toString();
	var latString = lat.toString();
	let str = longString + "+" + latString;
	str = addKey(str);
	//Print out key to see if it is working correctly
	console.log(str);
	return str;
}

class AddLocationScreen extends Component {

	 
	//user data to be sent to the database
	constructor(props){
		super(props);
		this.state = {
			name: '',
			long_lat: '',
			location: null,
			errorMessage: null,
			loc: "loc",
			tag: "tag",
			review: "review",
			unisex: false,
			baby: false,
			disabled: false,
			paytouse: false,
			upvote: false,
			downvote: false,
		};
	}

	//function to get the user's location data
	_getLocationAsync = async () => {

		//making sure to get user permission first
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied',
			});
		}
		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location });
	};

	//functions for when tags are checked
	unisexChecked() {
		this.setState({
			unisex:!this.state.unisex
		})
		alert("works!")
	}
	babyChecked() {
		this.setState({
			baby:!this.state.baby
		})
		alert("works!")
	}
	disabledChecked() {
		this.setState({
			disabled:!this.state.disabled
		})
		alert("works!")
	}
	paytouseChecked() {
		this.setState({
			paytouse:!this.state.paytouse
		})
		alert("works!")
	}
	upChecked() {
		this.setState({
			upvote:!this.state.upvote
		})
		alert("works!")
	}
	downChecked() {
		this.setState({
			downvote:!this.state.downvote
		})
		alert("works!")
	}


	//rendering of the app screen
	render() {
		return (
			<View style={{paddingTop: 40, flexDirection: 'column'}}>
				<Text>Name: </Text>
				<TextInput	//text input box for the user to enter the location name
					style={{height: 30, borderColor: 'gray', borderWidth: 1}}
					placeholder="Enter a Location Name Here"
					onChangeText={(text) => this.setState({name: text})}
				/>

				<Text>Description: </Text>
				<TextInput	//text input box for the user to enter a description of the location
					style={{height: 80, borderColor: 'gray', borderWidth: 1}}
					onChangeText={(text) => this.setState({desc: text})}
				/>

				<Text>Tags: </Text>
				<View style={{flexDirection: 'row'}}>		
					<Text>Unisex</Text><CheckBox //checkboxes for tags
						center
						value={this.state.unisex}
						title="Unisex"
						checked={this.state.checked}
						onChange={()=>this.unisexChecked()}
					/>
					<Text>Baby</Text><CheckBox
						center
						value={this.state.baby}
						title="Unisex"
						checked={this.state.checked}
						onChange={()=>this.boxChecked()}
					/>
					<Text>Disabled</Text><CheckBox
						center
						value={this.state.disabled}
						title="Unisex"
						checked={this.state.checked}
						onChange={()=>this.disabledChecked()}
					/>
					<Text>Pay to Use</Text><CheckBox
						center
						value={this.state.paytouse}
						title="Unisex"
						checked={this.state.checked}
						onChange={()=>this.paytouseChecked()}
					/>
				</View>
				<Text>Rate: </Text> 
				<View style={{flexDirection: 'row'}}>
					<Text>Upvote</Text><CheckBox //checkboxes for tags
						center
						value={this.state.check}
						title="Upvote"
						checked={this.state.upvote}
						onChange={()=>this.upChecked()}
					/>
					<Text>Downvote</Text><CheckBox
						center
						value={this.state.check}
						title="Downvote"
						checked={this.state.downvote}
						onChange={()=>this.downChecked()}
						//TODO: NEED TO MAKE IT SO YOU CAN'T DOWNVOTE AND UPVOTE IN SAME ENTRY
					/>
				</View>
				
				<Button //get the user location on submit button press then send data to db
					//TODO: add alert for when submission is successful and when it isn't
					style={{padding: 20}}
					onPress = {async () => {
						await
						this._getLocationAsync();
						addLocationToDynamo(global.state);
					}}
					title = "Submit Location"
				/>
>>>>>>> Stashed changes
			</View>
		);
	}
}

export default AddLocationScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
<<<<<<< Updated upstream
=======
import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Button
} from 'react-native';
import { Constants, MapView, Location, Permissions} from 'expo';
import { CheckBox } from 'react-native-elements';

var AWS = require('aws-sdk')

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
var creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: 'us-east-1:e7994f82-231f-43db-9a9b-e1868280592f',
});

AWS.config.credentials = creds;

// database connection
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});


// Adds a location to dynamodb using given data passed in 
function addLocationToDynamo(state) {

	/* 
		parameters to be entered into the database

		TableName = the name of the dynamodb database (do not change this)
		Item = the attributes (columns) and their data
			long_lat (required) = the partition key to uniquely identify the location 
			spec_type (required) = the sort key to group data entries by location, tags, or reviews
				these are hard-coded into the object being passed in already
			name, longitude and latitude all come from the user
	*/
	var params = {
		TableName: "toilets",
		Item: {
			"long_lat": longLatToString(state.location['coords']['longitude'], state.location['coords']['latitude']),
			"spec_type": state.loc,
			"name": state.name,
			"longitude": state.location['coords']['longitude'],
			"latitude": state.location['coords']['latitude']
		}
	}

	// sending data to the database
	ddb.put(params, function(err, data) {
	  if (err) {
	    console.log("Error", err.code, err.message);
	  } else {
	    console.log("Data has been entered into ", data.TableNames);
	  }
	});
}

//Randomizer function to call when generating primary key
function randomizer(){
	let val = Math.floor(Math.random() * Math.floor(10));
	val = val.toString();
	return val;
}

function addKey(str){
	//Should randomize more after discussing with the team
	let add = "-";
	add = add.concat(randomizer());
	let key = str.concat(add);
	return key;
}

function longLatToString(long, lat) {
	var longString = long.toString();
	var latString = lat.toString();
	let str = longString + "+" + latString;
	str = addKey(str);
	//Print out key to see if it is working correctly
	console.log(str);
	return str;
}

class AddLocationScreen extends Component {
	 
	// user data to be sent to the database
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			long_lat: '',
			location: null,
			errorMessage: null,
			loc: "loc",
			tag: "tag",
			review: "review",
			isChecked: true,
		};
	}

	// function to get the user's location data
	_getLocationAsync = async () => {

		// making sure to get user permission first
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied',
			});
		}
		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location });
	};

	// rendering of the app screen
	render() {
		return (
			<View style={{paddingTop: 40}}>

				<TextInput		// text input box for the user to enter the location name
					title="Name: "
					style={{height: 40}}
					placeholder="Enter a Location Name Here"
					onChangeText={(text) => this.setState({name: text})}
				/>

				<TextInput		// text input box for the user to enter a description of the location
					title="Description: "
					style={{height: 70, width: 600}}
					placeholder="Description"
					onChangeText={(text) => this.setState({desc: text})}
				/>

				// check boxes for tags
				<CheckBox
					center
					title="Unisex"
					onClick={(tags) => {this.setState({tags: Unisex})}}
				/>
				<CheckBox
					center
					title="Baby"
					onClick={(tags) => {this.setState({tags: Baby})}}

				/>
				<CheckBox
					center
					title="Disabled"
					onClick={(tags) => {this.setState({tags: Disabled})}}

				/>
				<CheckBox
					center
					title="Pay to Use"
					onClick={(tags) => {this.setState({tags: Pay to Use})}}

				/>


				
				
				<Button			// get the user location on submit button press then send data to db

					// ***need to add alert for when submission is successful and when it isn't
					onPress = {async () => {
						await this._getLocationAsync();
						addLocationToDynamo(this.state);
					}}
					title = "Submit Location"
				/>
			</View>
		  );
		}
}

export default AddLocationScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

// module.exports = longLatToString;
// testing travis ci

exports.longLatToString = longLatToString;
>>>>>>> Stashed changes
=======

//module.exports = longLatToString;
//testing travis ci

exports.longLatToString = longLatToString;
>>>>>>> Stashed changes
