const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment");

app.get("/", (req, res) => {
  res.send("DialogFlow Integration Server is Live");
});
var seats = 28;
var tables = [{
    id:1,
    seats: 4,
    booked: false,
},
{
    id:2,
    seats: 4,
    booked: false,
},
{
    id:3,
    seats: 4,
    booked: false,
},
{
    id:4,
    seats: 4,
    booked: false,
},
{
    id:5,
    seats: 4,
    booked: false,
},
{
    id:6,
    seats: 8,
    booked: false,
},
];
app.get('/getTables',(req, res) =>{
res.send(tables);
});

app.post("/getDialogData", express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res,
  });
  // dont forget to add /getDialogData in front of ngrok url
  function demo(agent) {
    let client = {
        name: "",
        guests: "",
        email: "",
    };
    client.name = agent.parameters.name;
    client.guests = agent.parameters.guests;
    // client.time = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('-')[0]));
    // client.dateTimeEnd = new Date(new Date(time).setHours(time.getHours() + 2));
    // client.date = new Date(agent.parameters.date);
    // client.bookingDate = new Date(client.date);
    // const phonenumber = agent.parameters.phone;
    client.email = agent.parameters.email;
    // client.phone = phonenumber.toString().length;
    console.log("CLient:", client);
    if (client.guests < 1){
        agent.add(`You need to reserve a table for at least one person. Please try remaking the reservation!`);
    } 
    if (client.guests > 20){
        agent.add(`You cannot book table for more than 20 peple!`);
    } 
    seats -= client.guests;
    // agent.add(`Seats left at the hotel are:${seats}`);
    if(seats <= 0){
        agent.add(`Sorry, reservation cannot be made now as the hotel is currently full`);
    }
    else
    {
        let bookedTables = " ";
        for(let table of tables){
            console.log("Reached");
            if(client.guests > 0 && !table.booked){
                console.log("Reached for:",table.id);
            if(table.seats > client.guests){
                table.name = client.name;
                table.booked = true;
                table.seats = 0;
                bookedTables += table.id + " ";
                client.guests = 0;
                break;
            }
            else{
                bookedTables += table.id + " ";
                table.name = client.name;
                table.booked=true;
                client.guests -= table.seats;
                table.seats = 0;
                
            }
        }
        }
        agent.add(`Booking Successful, Your Table Numbers are ${bookedTables}`);
        bookedTables = "";
        console.log("Tables", tables);
    }
  }
  var intentMap = new Map();
  intentMap.set("reservation", demo);
  agent.handleRequest(intentMap);
//   res.send("Dialog Data Received");
});

app.listen(3333, () => console.log("Server running on port 3333"));
