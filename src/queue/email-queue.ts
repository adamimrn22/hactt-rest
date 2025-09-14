import Queue, { Job } from 'bull';

export class EmailQueue {
    private static instance: EmailQueue;
    private queue: Queue.Queue;

    private constructor() {
        this.queue = new Queue('email-queue', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            },
        });

        this.queue.on('ready', () =>
            console.log('Redis queue connection ready...')
        );
        this.queue.on('error', (err) =>
            console.error('Redis connection error:', err)
        );
        this.queue.on('waiting', (jobId) =>
            console.log(`Job waiting: ${jobId}`)
        );
        this.queue.on('active', (job) => console.log(`Job started: ${job.id}`));
        this.queue.on('completed', (job) =>
            console.log(`Job completed: ${job.id}`)
        );
        this.queue.on('failed', (job, err) =>
            console.error(`Job ${job?.id} failed: ${err.message}`)
        );
    }

    public getQueue() {
        return this.queue;
    }

    public static getInstance(): EmailQueue {
        if (!EmailQueue.instance) {
            EmailQueue.instance = new EmailQueue();
        }
        return EmailQueue.instance;
    }

    public addJob(jobName: string, data: any): Promise<Job> {
        return this.queue.add(jobName, data, {
            attempts: 3, // Retry up to 3 times
            backoff: {
                type: 'fixed', // or 'exponential'
                delay: 5000, // 5 seconds between retries
            },
            removeOnComplete: true, // Clean up successful jobs
            removeOnFail: false, // Keep failed jobs for debugging
        });
    }

    public processJob(
        jobName: string,
        callback: (job: Job) => Promise<void>
    ): void {
        this.queue.process(jobName, callback);
    }
}
