const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {

    sgMail.send({

        to: email,
        from: "lucasmirezende12@gmail.com",
        subject: "Thanks for joining us!",
        text: `Welcome to the App, ${name}.`

    })
    
}

const sendCancelEmail = (email, name) => {

    sgMail.send({

        to: email,
        from: "lucasmirezende12@gmail.com",
        subject: "Have a good day.",
        text: `You are leaving the app, ${name}.`

    })
    
}

module.exports = {sendWelcomeEmail, sendCancelEmail}