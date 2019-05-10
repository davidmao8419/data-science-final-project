var SlackBot = require('slackbots');
const spawn = require("child_process").spawn;
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAP_API_TOKEN
});

var msgs = {
    0: "Hey I'm Mr. Taxi :smile::taxi: Tell me where you are.",
    1: "I got it! Now tell me where you want to go.",
    2: "Alright! The possible taxi fare would be $"
    //2: `Alright! The possible taxi fare would be $${generate_random_prcice()} :money_with_wings:`
    //2: "Alright! The possible taxi fare would be $19.34 :money_with_wings:"
}

function generate_random_prcice() {
    var min = 15.00;
    var max = 30.00;
    return (Math.random() * (max - min) + min).toFixed(2);
}

var id_status = {};
var id_start = {};
var id_end = {};

// create a  slackbot
var bot = new SlackBot({
    token: process.env.NUDGE_BOT_TOKEN,
    name:"NYC Helper"
});

bot.on('start', function(){
    console.log("bot started");
})

var testFunction = function(one, two) {
    return new Promise(function(resolve, reject) {
        const pyprog = spawn('python', ["./python_scripts/testing.py", one, two]);
        pyprog.stdout.on('data', function(data) {
            resolve(data);
        });
        pyprog.stderr.on('data', (data) => {
            reject(data);
        });
    });
  }

let runPy = new Promise(function(success, nosuccess) {
    const pyprog = spawn('python', ["./python_scripts/testing.py"]);
    pyprog.stdout.on('data', function(data) {
        success(data);
    });
    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    });
});

bot.on("message", msg => {
    switch (msg.type) {
    case "message":
      if (msg.channel[0] === "D" && msg.bot_id === undefined) {
        slackID = msg.user;
        if(!(slackID in id_status)) {
            id_status[slackID] = 0;
        } else {
            if(id_status[slackID]%3==0) {
                id_start[slackID] = msg.text;
            }
            if(id_status[slackID]%3==1) {
                id_end[slackID] = msg.text;
            }
            id_status[slackID] += 1;
        }
        
        /*
        if(msg.text == 'map') {
            console.log("!!!!!! in map");
            googleMapsClient.distanceMatrix({
                origins: 'rockefeller center',
                destinations: 'roosevelt island'
              }, function(err, response) {
                if (!err) {
                    console.log("get direction matrix success!!!");
                    console.log(response);
                    console.log("=======");
                    console.log(response.json.rows);
                    console.log("=======");
                    console.log(response.json.rows.elements);
                } else {
                    console.log("get direction matrix error ", err);
                }
              });
        }*/
        if(false && msg.text == "python") {
            /*
            const pythonProcess = spawn('python',["./python_scripts/testing.py", 1, 2]);
            console.log("run python");
            pythonProcess.stdout.on('data', (data) => {
                console.log("!!!!!!!!");
                // Do something with the data returned from python script
                var returned = data.toString();
                bot.postMessage(msg.user, `the returned value is ${returned}`, { as_user: true });
                //console.log("after running python script data: ", data.toString());
            });
            */
            
            testFunction(1, 2).then(function(res) {
                bot.postMessage(msg.user, `From python result ${res}`, {as_user: true});
            }).catch(function(err){
                console.log("!!!! ", err.toString());
            })

            /*
            runPy.then(function(res) {
                console.log(res.toString());
                bot.postMessage(msg.user, `From python result ${res}`, {as_user: true});
            }).catch(function(err){
                console.log("!!!! ", err.toString());
            });
            */
        }
        else {
            //bot.postMessage(msg.user, "hi from nyc helper", { as_user: true });
            status = id_status[slackID]%3;
            msg = msgs[status];
            if(status == 2) {
                msg = msg+generate_random_prcice()+" :money_with_wings:";
            }
            bot.postMessage(slackID, msg, { as_user: true });
            if(slackID in id_start) {
                //bot.postMessage(slackID, "start: "+id_start[slackID], {as_user: true});
            }
            if(slackID in id_end) {
                //bot.postMessage(slackID, "end: "+id_end[slackID], {as_user: true});
            }
        }
      }
      break
    }
})