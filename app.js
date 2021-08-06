////////////////// import process module from Node
const process = require('process');
const os = require('os');
const fs = require("fs");

////////////////// language objects
const STRING_DATA_COLLECTION_EN =
{
	StartupMessage: "Starting our Application",
	WaitMessage: "Please wait...",
	RecievedSignal: "Received signal",
};

const STRING_DATA_COLLECTION_FR =
{
	StartupMessage: "Démarrage de l'application",
	WaitMessage: "S'il vous plaît, attendez",
	RecievedSignal: "A reçu"

};

const STRING_DATA_COLLECTION_SP =
{
	StartupMessage: "Aplicación inicial",
	WaitMessage: "Espere por favor",
	RecievedSignal: "Señal recibida"
};

const STRING_DATA_COLLECTION_PT =
{
	StartupMessage: "Aplicativo inicial",
	WaitMessage: "Por favor, espere",
	RecievedSignal: "Sinal recebido"
};

const STRING_DATA_COLLECTION_TK =
{
	StartupMessage: "Uygulamanın Başlatılması",
	WaitMessage: "Lütfen bekle",
	RecievedSignal: "alınan sinyal"
};

const STRING_DATA_COLLECTION_JP =
{
	StartupMessage: "アプリケーションの開始",
	WaitMessage: "お待ちください",
	RecievedSignal: "受信信号"
};


////////////////// set default language
const STRING_DATA_COLLECTION_DEFAULT = STRING_DATA_COLLECTION_EN;


// The collection our program will actually use, which is mostly undefined until we define it
// I intend to have it overwritten a bit later in the application startup process
let STRING_DATA_COLLECTION =
{
	StartupMessage: undefined
};

////////////////// function 
//write/update HTML to show data on browser
const createHTML = () => {
	const html = fs.readFileSync(`${__dirname}/index.html`);
	fs.writeFileSync(`${process.cwd()}/index.html`, html);
};
createHTML();
//export
module.exports = createHTML;

//set language 
const setLanguage = (LanguageCollectionToUse) => {
	// We change the language by overwriting the active one with the one chosen
	STRING_DATA_COLLECTION = LanguageCollectionToUse;
};

//set back to default language
const setDefaultLangauge = () => {
	setLanguage(STRING_DATA_COLLECTION_DEFAULT);
};
//setDefaultLangauge();

// Make a getMsg function that takes a 'Key' and returns its value from the collection
// We will use this to get messages from the collection
const getMsg = (key) => {
	return STRING_DATA_COLLECTION[key];
};

// Lets display our startup message, but in our chosen language
console.log(getMsg("StartupMessage"));
console.log(getMsg("WaitMessage"));

// Begin reading from stdin so the process does not exit.
// This is a common trick to prevent our application terminating.
//read keyboard
process.stdin.resume();

// stop node application
process.on('SIGINT', () => {
	console.log("Stopping Node.js Application. See you soon :)");
	process.exit();
});

// Using a single function to handle multiple signals
const handle = (signal) => {
	console.log(getMsg("RecievedSignal") + ` ${signal}`);
};

// Here we attach to others and send their output to the above function
process.on('SIGINT', handle);
process.on('SIGTERM', handle);
process.on('SIGHUP', handle);

// This one is useful, because it lets us detect when the 'terminal' window
// is 'resized' on most platforms (but not all)
process.on('SIGWINCH', handle);

const windowWasResized = () => {
	console.log("window was resized");
};
windowWasResized();

// I create an object called application, just to represent a simple application
// I am implementing it here, but it will not execute until I have created an
// 'instance of it'
class Application {

	constructor(ExecutablePath, CommandLineArguments) {
		this.ExecutablePath = ExecutablePath;
		this.CommandLineArguments = CommandLineArguments;
	}

	//methods
	//#0
	showCommandLine() {
		console.log("Executable path is", this.ExecutablePath);
		console.log("Command Line Argument is ", this.CommandLineArguments);
	}
	//#1
	setLang() {
		if (this.CommandLineArguments.some(e => e === "JP")) {
			console.log("Language Changed to Japanese");
			setLanguage(STRING_DATA_COLLECTION_JP); //doesn't do anything...
		}
	}
	//#2
	showOsData() {
		if (this.CommandLineArguments.some(e => e === "os")) {
			console.log("hostname is ", os.hostname());
			console.log("userInfo is ", os.userInfo());
			console.log("version is ", os.version());
			console.log("platform is ", os.platform());
			console.log("release is ", os.release());
			console.log("totalmem (bytes) is ", os.totalmem());
		}
	}
	//#3
	showCPUData() {

	}
}

// The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched. 
// The first element will be process.execPath. 
// See process.argv0 if access to the original value of argv[0] is needed. The value can change if different node programs call other
// node programs, such as, this program, calls that program. 
// The second element will be the path to the JavaScript file being executed. 
// The remaining elements will be any additional command-line arguments.

let listOfArgument = [];

for (let i = 1; i < process.argv.length; i++) {
	listOfArgument.push(process.argv[i]);
	console.log("list of command line argument is", listOfArgument);
}

//instantiate
const myApplication = new Application(process.argv[0], listOfArgument);

//call methods : 	!!!!!!!! currently it only takes one parameter !!!!!!!!!!!
//#0 : show command line arguments
myApplication.showCommandLine();
//#1 : set language
myApplication.setLang();
//#2 : show OS data
myApplication.showOsData();
//#3 : show CPU data
myApplication.showCPUData();


/* Assignment */
// node yourapp.js --os
// node yourapp.js os
// node yourapp.js arch
// node yourapp.js os arch
// node yourapp.js cpu
// node yourapp.js cpu os arch
