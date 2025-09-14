import { PrismaClient } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

async function main() {
    const permissions = [
        'user.create',
        'user.read',
        'user.update',
        'user.delete',
        'project.create',
        'project.read',
        'project.update',
        'project.delete',
        'projectrole.create',
        'projectrole.read',
        'projectrole.update',
        'projectrole.delete',
        'permission.create',
        'permission.read',
        'permission.update',
        'permission.delete',
        'rolepermission.create',
        'rolepermission.read',
        'rolepermission.update',
        'rolepermission.delete',
        'testplan.create',
        'testplan.read',
        'testplan.update',
        'testplan.delete',
        'testsuite.create',
        'testsuite.read',
        'testsuite.update',
        'testsuite.delete',
        'testcase.create',
        'testcase.read',
        'testcase.update',
        'testcase.delete',
    ];

    const rolesWithPermissions = {
        admin: permissions,
        manager: ['testplan.read', 'testsuite.read', 'testcase.read'],
        user: ['testcase.read'],
    };

    // Create Permissions
    for (const code of permissions) {
        await prisma.permission.upsert({
            where: { code },
            update: {},
            create: { code },
        });
    }

    // Create Project Roles
    const roleMap: Record<string, string> = {}; // roleName -> roleId
    for (const roleName of Object.keys(rolesWithPermissions)) {
        const role = await prisma.projectRole.upsert({
            where: { name: roleName },
            update: {},
            create: {
                name: roleName,
                description: `${roleName} role`,
            },
        });
        roleMap[roleName] = role.id;
    }

    // Assign Permissions to Roles via ProjectRolePermission
    for (const [roleName, perms] of Object.entries(rolesWithPermissions)) {
        const roleId = roleMap[roleName];
        for (const code of perms) {
            const permission = await prisma.permission.findUnique({
                where: { code },
            });
            if (!permission) throw new Error(`Permission ${code} not found`);

            await prisma.projectRolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId,
                    permissionId: permission.id,
                },
            });
        }
    }

    // Create a User
    const user1 = await prisma.user.create({
        data: {
            email: 'test@example.com',
            password: 'hashedPassword', // In real case, use a hashed password
            role: 'USER',
            profile: {
                create: {
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '123456789',
                },
            },
        },
    });

    // Create Projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Project Alpha',
            description: 'First project for testing purposes.',
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'Project Beta',
            description: 'Second project for testing.',
        },
    });

    // Enroll user to a project with roleId (matching with ProjectRole)
    await prisma.userProjectEnrollment.create({
        data: {
            userId: user1.id,
            projectId: project1.id,
            roleId: roleMap['admin'], // Use roleId here, not role name
        },
    });

    // Create Test Plans
    const testPlan1 = await prisma.testPlan.create({
        data: {
            name: 'Test Plan 1',
            description: 'Test Plan for Alpha Project',
            projectId: project1.id,
        },
    });

    const testPlan2 = await prisma.testPlan.create({
        data: {
            name: 'Test Plan 2',
            description: 'Test Plan for Beta Project',
            projectId: project2.id,
        },
    });

    // Create Test Suites
    const testSuite1 = await prisma.testSuite.create({
        data: {
            name: 'Test Suite 1',
            description: 'Test Suite for Plan 1',
        },
    });

    const testSuite2 = await prisma.testSuite.create({
        data: {
            name: 'Test Suite 2',
            description: 'Test Suite for Plan 2',
        },
    });

    // Create Test Case
    const testCase1 = await prisma.testCase.create({
        data: {
            name: 'Test Case 1',
            description: 'Test case for feature A',
            steps: ['Step 1', 'Step 2'],
            expectedResult: 'Feature A works correctly',
        },
    });

    // Link TestPlan to TestSuites
    await prisma.testPlan_Suites.create({
        data: {
            testPlanId: testPlan1.id,
            testSuiteId: testSuite1.id,
        },
    });

    await prisma.testPlan_Suites.create({
        data: {
            testPlanId: testPlan2.id,
            testSuiteId: testSuite2.id,
        },
    });

    // Link TestSuite to TestCases
    await prisma.testSuite_Cases.create({
        data: {
            testSuiteId: testSuite1.id,
            testCaseId: testCase1.id,
        },
    });

    console.log('✅ Seed data has been successfully inserted!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
