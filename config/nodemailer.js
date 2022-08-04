const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leadwear01@gmail.com',
        pass: 'posxrgihzqqbaxbq'
    }
})

module.exports = {
    transport
}