import bcrypt from 'bcryptjs';

export class PasswordUtils {
    // Hash a password
    static async hashPassword(plainPassword: string): Promise<string> {
        const saltRounds = 10; // You can adjust the salt rounds based on your needs
        return bcrypt.hash(plainPassword, saltRounds);
    }

    // Compare a plain password with the hashed password
    static async comparePassword(
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // Generate a random password with a specified length (default: 12)
    static generateRandomPassword(length: number = 12): string {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }
}
