const express = require("express");
const app = express();
const wol = require("wake_on_lan");
const bodyParser = require("body-parser");
const {exec} = require("child_process");
const ping = require("ping");
const {ArgumentParser} = require("argparse");
const parser = new ArgumentParser({
	description: 'Wake On Lan Server Application'
});




parser.add_argument('-port', {help: 'Port of Service'});
parser.add_argument('-key', {help: 'Security Key for HTTP requests'});

args = parser.parse_args();

if(args.port === undefined || isNaN(args.port) || args.port < 0  ||  args.port > 35535){
	console.log("Please provide a valid Port. For more info try -h");
	return;
}

const PORT = args.port;
const KEY = args.key == undefined ? "" : args.key;

console.log(KEY);
console.log("Starting WOL-Service...");

app.use(bodyParser.json());

//Get Online-Status of PC
app.get("/", (req,res) => {
	console.log("Get received...");

	//No authorization provided
        if(!req.get('authorization')){
                console.log("No authorization");
                return res.status(403).json({error: 'No credentials provided!'});
        }

        //Wrong authorization provided
        if(req.get('authorization') != KEY){
                console.log("Wrong authorization");
                return res.status(403).json({error: 'Wrong credentials provided!'});
        }

	//Wrong parameter
	if(!req.query.mac){
		console.log("There was no MAC-Address provided");
		return res.status(400).json({error: 'No MAC-Address provided'});
	}

	let mac = req.query.mac;

	//Searching for PC in arp table
	exec("cat /proc/net/arp | grep " + mac + " | awk '{print $1}'", (err,output) => {
		if(err){
			//Something went wrong
			console.log(err);
			return res.status(500).json({error: err});
		}
		else{
			//PC was not found
			if(output.length === 0){
				console.log("PC was not found!");
				return res.send("Offline");
			}
			//PC was found
			console.log("Found the IP: " + output.slice(0,-1));
			ping.sys.probe(output.slice(0,-1), (isAlive) => {
				//The PC turned off recently, still in ARP but offline
				if(!isAlive){
					console.log("PC went offline recently")
					return res.send("Offline");
				}
				//PC is online and responding
				else{
					console.log("PC is online");
					return res.send("Online");
				}
			});
		}
	});
});


//Send WOL-package to MAC-Address
app.post("/", (req,res) => {
	console.log("Post received...");

	//No authorization provided
	if(!req.get('authorization')){
		console.log("No authorization");
		return res.status(403).json({error: 'No credentials provided!'});
	}

	//Wrong authorization provided
	if(req.get('authorization') != 'ypWdWpJ7ghG1vLZLmj'){
		console.log("Wrong authorization");
		return res.status(403).json({error: 'Wrong credentials provided!'});
	}

	//Authorized

	//No body
	if(!req.body){
		console.log("No body");
		return res.status(400).json({error: 'No body provided!'});
	}

	//Wrong Body
	if(!req.body.mac){
		console.log("Wrong body");
		return res.status(400).json({error: 'Wrong body provided!'});
	}

	//Good Post, process
	let mac = req.body.mac;
	console.log("Requesting waking up " + mac + "...");
	wol.wake(mac, (err) => {
		if(err){
			console.log("Error while waking up: " + err);
			return req.status(500).json({error: err});
		}
		else{
			console.log("Wakeup call sent!");
			return res.send("Wakeup call was sent!");
		}
	});
});



console.log("Ready!");




app.listen(PORT, err => {
	if(err){
		console.log("There was a problem while listening to port " + port, err);
		return;
	}
	console.log("Listening to port " + PORT);
});
