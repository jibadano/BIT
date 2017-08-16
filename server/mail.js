'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '71mb4.noreply@gmail.com',
        pass: 'Opus9no2'
    }
});

function sendMail(to, subject,body){
	let mailOptions = {
		from: '"71mb4" <71mb4.noreply@gmail.com>', // sender address
		to: to, // list of receivers
		subject: '71mb4 - ' + subject, // Subject line
		text: '', // plain text body
		html: `<div style="    color: white;
    background: #2a3330;
    font-size: 50px;
    padding: 70px;
    text-align: center;
    font-weight: bold;" > 71mb4 <br> <br>` + body + `
	</div>
	
	` 
	};
	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error)
			return console.log(error);
		console.log('Message %s sent: %s', info.messageId, info.response);
	});
}

exports.send=sendMail;