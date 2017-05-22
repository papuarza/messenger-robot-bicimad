var express = require('express');
var router = express.Router();
request = require('request');
axios = require('axios');




/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query['hub.mode'] === 'subscribe' &&
     req.query['hub.verify_token'] === "papuarza") {
   console.log("Validating webhook");
   res.status(200).send(req.query['hub.challenge']);
 } else {
   console.error("Failed validation. Make sure the validation tokens match.");
   res.sendStatus(403);
 }
});

router.post('/', function (req, res) {
  // get info about a tag
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {
    // // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
    //   // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });
        res.sendStatus(200);
      }
    });

  function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  // console.log("Received message for user %d and page %d at %d with message:",
    // senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.


    axios({
    method:'get',
    url:"https://rbdata.emtmadrid.es:8443/BiciMad/get_single_station/WEB.SERV.papu.arza@gmail.com/2E71574E-2529-4A54-A5ED-1D58E7AC34BE/"+messageText,
    responseType:'json'
  })
    .then(function(response) {
      let msgData = JSON.parse(response.data.data).stations[0];
      sendGenericMessage(senderID, msgData);
  });

    // switch (messageText) {
    //   case 'papu':
    //     sendPapuMessage(senderID);
    //     break;
    //
    //   default:
    //     sendGenericMessage(senderID);
    // }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendPapuMessage(recipientId, messageText) {

  var messageData = {
   recipient: {
     id: recipientId
   },
   message: {
     text: "guapo",
     metadata: "DEVELOPER_DEFINED_METADATA"
   }
 };

 callSendAPI(messageData);
}

function sendGenericMessage(recipientId, messageText) {

  var messageData = {
   recipient: {
     id: recipientId
   },
   message: {
     text: "Nombre: "+messageText.name+"\nBicis disponibles: "+messageText.dock_bikes+"\nBases Disponibles: "+messageText.free_bases,
     metadata: "DEVELOPER_DEFINED_METADATA"
   }
 };
callSendAPI(messageData);
}
//
// function sendTextMessage(recipientId, messageText) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       text: messageText
//     }
//   };
//
//   callSendAPI(messageData);
// }
//

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAErntm2UYIBABVZAlLQiEPBQP1kWMG81bBjSTy7sWTCjaRFxBj3UWoqfoCxt5XZCCAcp4ERQQJgdmtWCBPOIdZCrGHwoTKHjnKZCSFe2GUTbsLnnUPg8YDLUxYuxql1M844wlzA0CdwJOcCWyOJTRlyoXNjZBobv6g3jJKlqfQZDZD" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
        messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s",
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}




module.exports = router;
