var Alpr = require('../models/alpr');
const crypto = require('crypto');
let nodemailer = require('nodemailer');

//Atnāk modelis kur pārbaudas vai viņs eksistē datubāzē. Ja tāda numurzīme eksistē, tad mēs atjaunojam "exit_date"
//gadijumā ja numurzīmes nav, tiek izveidōts jauns ieraksts
exports.create = async function (req, email) {
    let car = await Alpr.findOne({plate: req.results[0].plate, exit_date: null})
    if (car) {
        car.exit_date = Date.now();
        await car.save();
        let transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "e2d30fadaec908",
                pass: "62c1493823805c"
            }
        });

        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <parking@example.com>',
            to: car.email ?? 'test@example.com',
            subject: "Car Parking",
            text: `Your car with plate number ${car.plate} exited parking at ${car.exit_date}`, // plain text body
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } else {
        let newAlpr = new Alpr({
            uuid: crypto.randomUUID(),
            email: email,
            plate: req.results[0].plate
        })
        try {
            await newAlpr.save();
            console.log(newAlpr);
        } catch (err) {
            console.log(err);
        }
    }

};

function sendEmail(){

}

