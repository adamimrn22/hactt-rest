import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { EmailTransporter } from '@/utils/email-transporter';

export class MailService {
    private transporter = EmailTransporter.getTransporter();

    public async sendEmail(
        to: string,
        subject: string,
        templateName: string,
        variables: Record<string, any>
    ): Promise<void> {
        const templatePath = path.join(
            process.cwd(),
            'src',
            'mail',
            'templates',
            templateName
        );

        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        const html = template(variables);

        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
        });
    }
}
