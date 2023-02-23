const express = require("express");
const app = express();
require("dotenv").config();
const bizSdk = require("facebook-nodejs-business-sdk");
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const DeliveryCategory = bizSdk.DeliveryCategory;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;
app.post("/conversion", (request, res) => {
    const access_token = process.env.ACCESS_TOKEN;

    const pixel_id = process.env.PIXEL_ID;
    const test_event_code = "TEST40297";

    const api = bizSdk.FacebookAdsApi.init(access_token);

    let current_timestamp = Math.floor(new Date() / 1000);
    const userData = new UserData()
        .setEmails(["vikashrajpoot2995@gmail.com"])
        .setPhones(["12345678901", "14251234567"])
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(request.remoteAddress)
        .setClientUserAgent(request.headers["user-agent"])
        .setFbp("fb.1.1558571054389.1098115397")
        .setFbc("fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890");
    const content = new Content()
        .setId("product123")
        .setQuantity(1)
        .setDeliveryCategory(DeliveryCategory.HOME_DELIVERY);

    const customData = new CustomData()
        .setContents([content])
        .setCurrency("INR")
        .setValue(123.45);

    const serverEvent = new ServerEvent()
        .setEventName("Purchase")
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl("http://epviindia.com")
        .setActionSource("website");

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(
        eventsData
    );

    eventRequest.execute().then(
        (response) => {
            res.send(response);
        },
        (err) => {
            console.error("Error: ", err);
        }
    );
});
app.listen(3000, () => {
    console.log("App is listening at port 3000 ");
});