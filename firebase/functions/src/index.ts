import * as functions from "firebase-functions";

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

export const addHeader = functions
  .region("europe-west3")
  .https
  .onRequest((req, res) => {
    if (req.method !== "POST") {
      res.status(400).send("Please send a POST request");
      return;
    }
    try {
      db.collection("headlines").add({
        headline: req.body.headline,
        link: req.body.link,
      });
      res.status(200).send("Data successfully written to Firestore!");
    } catch (error) {
      console.error("Error writing to Firestore: ", error);
      res.status(500).send("Failed to write data to Firestore");
    }

  });
