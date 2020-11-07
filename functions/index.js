const functions = require('firebase-functions');
const admin = require('firebase-admin');
var GeoPoint = require('geopoint');
//output in kilometers
admin.initializeApp(functions.config().firebase);

exports.sendDangerAlert = functions.https.onCall((data, context) => {
  uid= data['uid']
  documentSnapshot.ref.collection("users").update({ 
    isSafe: false
  })
  const users = admin.firestore().collection('users');
  const payload = {
    notification: {
      title: 'Someone is in Danger near you',
      body: `Go and help!`,
      icon: 'your-icon-url',
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    data: {
      latitude: String(data["latitude"]), longitude: String(data["longitude"]), time: String(Date.now())
    }
  };
  users.listDocuments().then(documentRefs => {
    return admin.firestore().getAll(...documentRefs);
  }).then(documentSnapshots => {
    let alertedUserList = []
    for (let documentSnapshot of documentSnapshots) {
      if (documentSnapshot.exists && documentSnapshot.get("location") !== null && documentSnapshot.get("uid") !== uid) {
        point1 = new GeoPoint(data["latitude"], data["longitude"]);
        point2 = new GeoPoint(documentSnapshot.get("location")["latitude"], documentSnapshot.get("location")["longitude"]);
        var distance = point1.distanceTo(point2, true)
        if (distance < 10) {
          admin.messaging().sendToDevice(documentSnapshot.get("fcmToken"), payload);
          alertedUserList.push(documentSnapshot.get("uid"))
        }
      } else {
        console.log(`Found missing document: ${documentSnapshot.id}`);
      }
    }
    console.log("alertedUserList", alertedUserList)
    documentSnapshot.ref.collection("alerts").add({ 
      location: { 
        latitude: data["latitude"], 
        longitude: data["longitude"] 
      }, 
      alertedUserList: alertedUserList,
      alertTime: Date.now(),
      uid: uid
    })
  });
});

exports.sendSafeAlert = functions.https.onCall((data, context) => {
  uid = data['uid']
  documentSnapshot.ref.collection("users").update({ 
    isSafe: false
  })
  const users = admin.firestore().collection('users');
  const payload = {
    notification: {
      title: 'The person is now safe',
      body: `Go home now`,
      icon: 'your-icon-url',
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    data: {
      latitude: String(data["latitude"]), longitude: String(data["longitude"]), time: String(Date.now())
    }
  };
  users.listDocuments().then(documentRefs => {
    return admin.firestore().getAll(...documentRefs);
  }).then(documentSnapshots => {
    let alertedUserList = []
    for (let documentSnapshot of documentSnapshots) {
      if (documentSnapshot.exists && documentSnapshot.get("location") !== null && documentSnapshot.get("uid") !== uid) {
        point1 = new GeoPoint(data["latitude"], data["longitude"]);
        point2 = new GeoPoint(documentSnapshot.get("location")["latitude"], documentSnapshot.get("location")["longitude"]);
        var distance = point1.distanceTo(point2, true)
        if (distance < 10) {
          admin.messaging().sendToDevice(documentSnapshot.get("fcmToken"), payload);
          alertedUserList.push(documentSnapshot.get("uid"))
        }
      } else {
        console.log(`Found missing document: ${documentSnapshot.id}`);
      }
    }
    console.log("alertedUserList", alertedUserList)
    documentSnapshot.ref.collection("alerts").add({ 
      location: { 
        latitude: data["latitude"], 
        longitude: data["longitude"] 
      }, 
      alertedUserList: alertedUserList,
      alertTime: Date.now(),
      uid: uid
    })
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
