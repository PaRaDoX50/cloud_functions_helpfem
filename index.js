const functions = require('firebase-functions');
const admin = require('firebase-admin');
var GeoPoint = require('geopoint');
//output in kilometers
admin.initializeApp(functions.config().firebase);

exports.sendDangerAlert = functions.https.onCall((data, context) => {
    const users = admin.firestore().collection('users');

    // let collectionRef = firestore.collection('col');
    // let collectionRef = firestore.collection('col');
    const payload = {
        notification: {
          title: 'Someone is in DANGER',
          body: `Go and help!`,
          icon: 'your-icon-url',
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        data:{
            latitude:String(data["latitude"]),longitude:String(data["longitude"]),time:String(Date.now())
        }
      };
  
    // var message = {
    //     data: {
    //       latitude: data["latitude"],
    //       longitude:data["longitude"]
    //     },
    //     token: data["token"]
    //   };

 users.listDocuments().then(documentRefs => {
     
     
   return admin.firestore().getAll(...documentRefs);
}).then(documentSnapshots => {
   for (let documentSnapshot of documentSnapshots) {
      if (documentSnapshot.exists && documentSnapshot.get("location") != null) {
          console.log(data["longitude"]+"hell")
          console.log(documentSnapshot.get("location")["latitude"]+"hell1")
          console.log(documentSnapshot.get("location")+"hell2")
        point1 = new GeoPoint(data["latitude"], data["longitude"]);
        point2 = new GeoPoint(documentSnapshot.get("location")["latitude"], documentSnapshot.get("location")["longitude"]);
        var distance = point1.distanceTo(point2, true)
        if(distance < 10){
            
            admin.messaging().sendToDevice(documentSnapshot.get("fcmToken"),payload);

            documentSnapshot.ref.collection("dangerNotifications").add({location:{latitude:data["latitude"],longitude:data["longitude"]},time:Date.now()})
        }
      } else {
        console.log(`Found missing document: ${documentSnapshot.id}`);
      }
   }
});

// users.where('foo', '==', 'bar').get().then(querySnapshot => {
//   querySnapshot.forEach(documentSnapshot => {
    
//     console.log(`Found document at ${documentSnapshot.ref.path}`);
//   });
// });
    
    // return users.add({
    //     name: data["name"],
    //     email: data["email"]
    // });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
