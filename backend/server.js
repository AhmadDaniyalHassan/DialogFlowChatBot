// here is all the import library and dependency
const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();
const axios = require("axios");
const env = require('dotenv').config()
const moment = require('moment');

// here is the port number
const port = process.env.PORT

// This method is used to parse the incoming requests with JSON payloads and is based upon the bodyparser. 
app.use(express.json())

// webhookclient takes req, and res it is a constructor function inside the dialog flow library
app.post("/webhook", (req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res,
    });
    // here is a data type Map which used to get intent from dialogflow and give response accoridng to the API
    let intentMap = new Map();
    intentMap.set("getOrderID", orderNumber);

    // agent and handleRequest is the functions of dialogflow Fullfilment
    agent.handleRequest(intentMap).catch((err) => {
        console.log(err);
        res.status(400).send('There is an error occured');
    });
});

// here post axios request is made to the API and to get data according to the user input for ex: orderid= 2313 res = your order is 2313 shipment data xyz
async function orderNumber(agent) {
    let orderId = agent.parameters.number;
    try {
        const response = await axios.post(`${process.env.API}`, { orderId: orderId }, { headers: { "Content-Type": "application/json" } });

        const apiRes = response.data;

        // here moment library is used to convert the date format
        const shippedRes = moment(apiRes.shipmentDate).format("dddd, MMMM Do YYYY, h:mm:ss A");

        //here is the response of dialogflow which is going through node server to dialogflow
        agent.add(`Your order ${orderId} will be shipped by ${shippedRes}`);

    } catch (err) {
        // if the input is not valid then it will show the error message
        console.log(err);
        agent.add("No orders against the provided order id is found.");
    }
}

// express server is running
app.listen(port, () => console.log(`Server is running on port ${port}`));


////////////////////////////MISC/////////////////////////
// intentMap.set("EndGreet", playMusic)
// function playMusic(agent) {
//     agent.add({
//         payload: {
//             google: {
//                 richResponse: {
//                     items: [
//                         {
//                             simpleResponse: {
//                                 textToSpeech: 'Sure! Here is some music for you to enjoy.',
//                             },
//                         },
//                         {
//                             mediaResponse: {
//                                 mediaType: 'AUDIO',
//                                 mediaObjects: [
//                                     {
//                                         name: 'Music',
//                                         description: 'Click to play music',
//                                         largeImage: {
//                                             url: '',
//                                             accessibilityText: 'Music Image',
//                                         },
//                                         contentUrl: '',
//                                     },
//                                 ],
//                             },
//                         },
//                     ],
//                 },
//             },
//         },
//     });
// }
