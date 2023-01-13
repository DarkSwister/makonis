let amqp = require('amqplib/callback_api');
const exec = require('child_process').exec;
let minio = require('minio')
let minioClient = new minio.Client({
    endPoint:  "minio",
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});
const alpr = require('./controllers/alpr');

//Rabbit tur atverto connection uz rindu ar nosaukumu cars un pārsūta faila nosaukumu apstrādātājam
exports.send = function(image){
    amqp.connect('amqp://rabbit:5672', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            let queue = 'cars';
            let msg = image;

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [x] Sent %s", msg);
        });

    });
}

//Apstrādātājs, gaida faila nosaukumu
amqp.connect('amqp://rabbit:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        let queue = 'cars';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
            //atrod failu iekš minio
            minioClient.fGetObject('cars', msg.content.toString(), `tmp/${msg.content.toString()}`, function (err) {
                if (err) {
                    console.log(err)
                }
                //izmantojos openalpr atpazīstam nummurzīmi
                console.log('Car image received')
                exec(`alpr -c eu -p lv -j ./tmp/${msg.content.toString()}`,(error, stdout,stderr) => {
                    if (error) {
                        console.log(JSON.stringify(error));
                    } else {
                        const result = JSON.parse(stdout)

                        if (result.results.length < 1) {
                            console.log('No plates found in image')
                        } else {
                            alpr.create(JSON.parse(stdout.toString()));
                        }
                    }
                });
            })
        }, {
            noAck: true
        });
    });
});