import { EmailQueue } from '@/queue/email-queue';
import { MailService } from '@/services/mail.service';

export class EmailProcessor {
    private emailQueue = EmailQueue.getInstance();
    private mailService = new MailService();

    public start(): void {
        console.log('Worker started...');

        this.emailQueue.processJob('send-welcome-email', async (job) => {
            console.log('Processing job:', job.data);
            const { email, password } = job.data;
            await this.mailService.sendEmail(
                email,
                'Welcome to Hyper Agile Collaboration Testing Tool',
                'welcome-email.html',
                { email, password }
            );
            console.log(`Email sent to ${email}`);
        });

        // Listen for job failures
        this.emailQueue.getQueue().on('failed', (job, err) => {
            console.error(
                `Job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`
            );
        });
    }
}

if (require.main === module) {
    new EmailProcessor().start();
}
