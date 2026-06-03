import { transporter, mailFrom } from '../config/mail.config.js'

export const sendEmail = async ({ to, subject, html }) => {
    const info = await transporter.sendMail({
        from: mailFrom,
        to,
        subject,
        html
    })

    return info
}