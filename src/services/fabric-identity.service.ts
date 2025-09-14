// FabricIdentityService.ts
import { PrismaClient } from '@prisma/client';
import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const CA_URL = 'https://localhost:7054';
const CA_NAME = 'ca-org1';
const MSP_ID = 'Org1MSP';
const ADMIN_ID = 'admin';
const ADMIN_SECRET = 'adminpw';
const TLS_CERT_PATH = path.resolve(
    __dirname,
    '../../../test-network/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem'
);

export class FabricIdentityService {
    private ca: FabricCAServices;

    constructor() {
        const tlsCert = fs.readFileSync(TLS_CERT_PATH);
        this.ca = new FabricCAServices(
            CA_URL,
            { trustedRoots: tlsCert, verify: false },
            CA_NAME
        );
    }

    async enrollAdmin(walletPath: string) {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        if (await wallet.get(ADMIN_ID)) {
            console.log('Admin already enrolled');
            return;
        }

        const enrollment = await this.ca.enroll({
            enrollmentID: ADMIN_ID,
            enrollmentSecret: ADMIN_SECRET,
        });

        const identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSP_ID,
            type: 'X.509',
        };

        await wallet.put(ADMIN_ID, identity);
        console.log('Admin enrolled successfully');
    }

    /**
     * Register & Enroll user with permissions from Role
     */
    async registerAndEnrollUser(
        userId: string,
        projectId: string,
        walletPath: string
    ) {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        if (await wallet.get(userId)) {
            console.log(`User ${userId} already enrolled`);
            return;
        }

        const adminIdentity = await wallet.get(ADMIN_ID);
        if (!adminIdentity)
            throw new Error('Admin identity missing, enroll admin first');

        const provider = wallet
            .getProviderRegistry()
            .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(
            adminIdentity,
            ADMIN_ID
        );

        // Get user's role in the project
        const enrollment = await prisma.userProjectEnrollment.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
            select: { role: true },
        });

        if (!enrollment) throw new Error('User is not enrolled in the project');

        // Get permissions for that role
        const rolePermissions = await prisma.rolePermission.findMany({
            where: { role: enrollment.role },
            include: { permission: true },
        });

        if (!rolePermissions.length) {
            throw new Error(
                `No permissions assigned to role ${enrollment.role}`
            );
        }

        // Build Fabric CA attributes
        const attrs = rolePermissions.map((rp) => ({
            name: rp.permission.code,
            value: 'true',
            ecert: true,
        }));

        // Register user with Fabric CA
        const secret = await this.ca.register(
            {
                affiliation: 'org1.department1',
                enrollmentID: userId,
                role: 'client',
                attrs,
            },
            adminUser
        );

        // Enroll user
        const enrollmentResponse = await this.ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });

        const userIdentity: X509Identity = {
            credentials: {
                certificate: enrollmentResponse.certificate,
                privateKey: enrollmentResponse.key.toBytes(),
            },
            mspId: MSP_ID,
            type: 'X.509',
        };

        await wallet.put(userId, userIdentity);
        console.log(`User ${userId} enrolled and added to wallet`);
    }

    /**
     * Extract ABAC permissions from X509 cert attributes and generate JWT
     */
    async generateJWT(userId: string, walletPath: string, jwtSecret: string) {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const identity = await wallet.get(userId);

        if (!identity) throw new Error('User identity not found');

        // Parse the certificate to extract attributes
        // For simplicity, we decode the certificate's extensions and get attributes
        // This is simplified; you might want to use 'x509' or 'node-forge' library

        // Fabric cert attributes are stored in OID extension 1.2.3.4.5.6.7 (example)
        // Alternatively, your app must track these or parse them from cert metadata

        // For demo, assume we stored permissions in identity metadata or get from DB:
        // This is where your logic to parse real cert attributes goes

        // Here: We use the DB to simulate permissions for JWT (replace with cert parse)
        // You can enhance this with proper X509 parsing

        const userEnrollments = await prisma.userProjectEnrollment.findMany({
            where: { userId },
            select: { role: true },
        });

        if (!userEnrollments.length)
            throw new Error('User enrollment not found');

        // Aggregate all permissions across roles/projects (simplified)
        const roleNames = userEnrollments.map((ue) => ue.role);

        const rolePermissions = await prisma.rolePermission.findMany({
            where: { role: { in: roleNames } },
            include: { permission: true },
        });

        const permissions = rolePermissions.map((rp) => rp.permission.code);

        // Create JWT
        const token = jwt.sign(
            {
                sub: userId,
                permissions,
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return token;
    }
}
