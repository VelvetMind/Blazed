const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('ytDcHsk9Q7-IU_TtetFbpw');
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey("ytDcHsk9Q7-IU_TtetFbpw");

exports.ipnHandler = functions.https.onRequest(async (req, res) => {
    const body = req.body;
    const email = body.payer_email || body.custom;

    if (body.payment_status === "Completed") {
        const msg = {
            to: email,
            from: 'noreply@c-penn-music.com',
            subject: 'Your Backlash Song Download',
            html: `<p>Thank you for your support!</p><p><a href="https://velvetmind.github.io/backlash-download.html">Click here to download Backlash</a></p>`,
        };
        await sgMail.send(msg);
        await admin.firestore().collection("purchases").add({ email, timestamp: new Date() });
        res.status(200).send("OK");
    } else {
        res.status(400).send("Payment not completed");
    }
});
