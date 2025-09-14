require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';

export class EmailTransporter {
    private static transporter: Transporter;

    public static getTransporter(): Transporter {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
        return this.transporter;
    }
}
