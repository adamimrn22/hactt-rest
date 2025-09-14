const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    try {
        // Clean existing data (optional - comment out if you want to keep existing data)
        console.log('🧹 Cleaning existing data...');
        await prisma.testPlan_Suites.deleteMany();
        await prisma.testSuite_Cases.deleteMany();
        await prisma.testCase.deleteMany();
        await prisma.testSuite.deleteMany();
        await prisma.testPlan.deleteMany();
        await prisma.projectRolePermission.deleteMany();
        await prisma.userProjectEnrollment.deleteMany();
        await prisma.permission.deleteMany();
        await prisma.projectRole.deleteMany();
        await prisma.project.deleteMany();
        await prisma.userProfile.deleteMany();
        await prisma.user.deleteMany();

        // 1. Create Permissions
        console.log('📝 Creating permissions...');
        const permissions = [
            { code: 'project.view', description: 'View project details' },
            { code: 'project.edit', description: 'Edit project information' },
            { code: 'project.delete', description: 'Delete projects' },
            { code: 'testplan.view', description: 'View test plans' },
            { code: 'testplan.create', description: 'Create test plans' },
            { code: 'testplan.edit', description: 'Edit test plans' },
            { code: 'testplan.delete', description: 'Delete test plans' },
            { code: 'testsuite.view', description: 'View test suites' },
            { code: 'testsuite.create', description: 'Create test suites' },
            { code: 'testsuite.edit', description: 'Edit test suites' },
            { code: 'testsuite.delete', description: 'Delete test suites' },
            { code: 'testcase.view', description: 'View test cases' },
            { code: 'testcase.create', description: 'Create test cases' },
            { code: 'testcase.edit', description: 'Edit test cases' },
            { code: 'testcase.delete', description: 'Delete test cases' },
            { code: 'testcase.execute', description: 'Execute test cases' },
            { code: 'user.manage', description: 'Manage users in project' },
            { code: 'report.view', description: 'View test reports' },
            { code: 'report.generate', description: 'Generate test reports' },
        ];

        const createdPermissions = [];
        for (const permission of permissions) {
            const created = await prisma.permission.create({
                data: permission,
            });
            createdPermissions.push(created);
        }

        // 2. Create Project Roles with permissions
        console.log('👥 Creating project roles...');
        const projectRolesData = [
            {
                name: 'QA Lead',
                description:
                    'Quality Assurance Team Lead with full testing permissions',
                permissions: [
                    'project.view',
                    'project.edit',
                    'testplan.view',
                    'testplan.create',
                    'testplan.edit',
                    'testplan.delete',
                    'testsuite.view',
                    'testsuite.create',
                    'testsuite.edit',
                    'testsuite.delete',
                    'testcase.view',
                    'testcase.create',
                    'testcase.edit',
                    'testcase.delete',
                    'testcase.execute',
                    'user.manage',
                    'report.view',
                    'report.generate',
                ],
            },
            {
                name: 'QA Tester',
                description:
                    'Quality Assurance Tester with testing execution permissions',
                permissions: [
                    'project.view',
                    'testplan.view',
                    'testsuite.view',
                    'testcase.view',
                    'testcase.create',
                    'testcase.edit',
                    'testcase.execute',
                    'report.view',
                ],
            },
            {
                name: 'Developer',
                description:
                    'Software Developer with limited testing permissions',
                permissions: [
                    'project.view',
                    'testplan.view',
                    'testsuite.view',
                    'testcase.view',
                    'testcase.create',
                    'testcase.edit',
                ],
            },
            {
                name: 'Tester',
                description: 'Manual Tester focused on test execution',
                permissions: [
                    'project.view',
                    'testplan.view',
                    'testsuite.view',
                    'testcase.view',
                    'testcase.execute',
                    'report.view',
                ],
            },
            {
                name: 'Test Manager',
                description:
                    'Test Manager with comprehensive project oversight',
                permissions: [
                    'project.view',
                    'project.edit',
                    'testplan.view',
                    'testplan.create',
                    'testplan.edit',
                    'testplan.delete',
                    'testsuite.view',
                    'testsuite.create',
                    'testsuite.edit',
                    'testsuite.delete',
                    'testcase.view',
                    'testcase.create',
                    'testcase.edit',
                    'testcase.delete',
                    'testcase.execute',
                    'user.manage',
                    'report.view',
                    'report.generate',
                ],
            },
            {
                name: 'Automation Engineer',
                description: 'Test Automation Engineer with automation focus',
                permissions: [
                    'project.view',
                    'testplan.view',
                    'testplan.create',
                    'testplan.edit',
                    'testsuite.view',
                    'testsuite.create',
                    'testsuite.edit',
                    'testcase.view',
                    'testcase.create',
                    'testcase.edit',
                    'testcase.execute',
                    'report.view',
                ],
            },
        ];

        const createdProjectRoles = [];
        for (const roleData of projectRolesData) {
            const projectRole = await prisma.projectRole.create({
                data: {
                    name: roleData.name,
                    description: roleData.description,
                },
            });
            createdProjectRoles.push(projectRole);

            // Create role permissions
            const rolePermissions = [];
            for (const permissionCode of roleData.permissions) {
                const permission = createdPermissions.find(
                    (p) => p.code === permissionCode
                );
                if (permission) {
                    rolePermissions.push({
                        roleId: projectRole.id,
                        permissionId: permission.id,
                    });
                }
            }

            if (rolePermissions.length > 0) {
                await prisma.projectRolePermission.createMany({
                    data: rolePermissions,
                });
            }
        }

        // 3. Create Users with Profiles
        console.log('👤 Creating users and profiles...');
        const users = [];

        for (let i = 0; i < 50; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const userRole = Math.random() > 0.5 ? 'USER' : 'ADMIN';

            const user = await prisma.user.create({
                data: {
                    email: faker.internet
                        .email({ firstName, lastName })
                        .toLowerCase(),
                    password: faker.internet.password({ length: 12 }),
                    role: userRole,
                    profile: {
                        create: {
                            firstName,
                            lastName,
                            phone: faker.phone.number(),
                        },
                    },
                },
                include: { profile: true },
            });
            users.push(user);
        }

        // 4. Create Projects
        console.log('🚀 Creating projects...');
        const projects = [];
        const projectNames = [
            'E-commerce Platform',
            'Mobile Banking App',
            'Healthcare Management System',
            'Social Media Dashboard',
            'Inventory Management',
            'Customer Support Portal',
            'Learning Management System',
            'HR Management Platform',
            'Financial Analytics Tool',
            'IoT Device Management',
            'Content Management System',
            'Real Estate Platform',
            'Food Delivery App',
            'Travel Booking System',
            'Event Management Platform',
        ];

        for (let i = 0; i < 15; i++) {
            const projectName = faker.helpers.arrayElement(projectNames);
            const project = await prisma.project.create({
                data: {
                    name: `${projectName} ${faker.number.int({
                        min: 1,
                        max: 999,
                    })}`,
                    description: faker.lorem.paragraph(2),
                    channelName: faker.string.alphanumeric(8).toLowerCase(),
                    createdAt: faker.date.past({ years: 1 }),
                    updatedAt: faker.date.recent({ days: 30 }),
                },
            });
            projects.push(project);
        }

        // 5. Create User Project Enrollments
        console.log('🔗 Creating user project enrollments...');
        const enrollments = [];

        // Ensure each project has at least one user from each role
        for (const project of projects) {
            const projectUsers = faker.helpers.arrayElements(users, {
                min: 3,
                max: 8,
            });

            for (const user of projectUsers) {
                // Check if enrollment already exists
                const existingEnrollment = enrollments.find(
                    (e) => e.userId === user.id && e.projectId === project.id
                );

                if (!existingEnrollment) {
                    const selectedRole =
                        faker.helpers.arrayElement(createdProjectRoles);
                    const enrollment =
                        await prisma.userProjectEnrollment.create({
                            data: {
                                userId: user.id,
                                projectId: project.id,
                                roleId: selectedRole.id,
                            },
                        });
                    enrollments.push({
                        userId: enrollment.userId,
                        projectId: enrollment.projectId,
                        roleId: enrollment.roleId,
                    });
                }
            }
        }

        // 6. Create Test Plans
        console.log('📋 Creating test plans...');
        const testPlans = [];
        const testPlanTypes = [
            'Functional Testing',
            'Integration Testing',
            'Performance Testing',
            'Security Testing',
            'User Acceptance Testing',
            'Regression Testing',
            'Smoke Testing',
            'API Testing',
            'Mobile Testing',
            'Cross-browser Testing',
        ];

        for (const project of projects) {
            const numTestPlans = faker.number.int({ min: 2, max: 5 });

            for (let i = 0; i < numTestPlans; i++) {
                const testPlanType = faker.helpers.arrayElement(testPlanTypes);
                const testPlan = await prisma.testPlan.create({
                    data: {
                        name: `${testPlanType} - ${project.name}`,
                        description: faker.lorem.paragraph(),
                        projectId: project.id,
                        createdAt: faker.date.between({
                            from: project.createdAt,
                            to: new Date(),
                        }),
                        updatedAt: faker.date.recent({ days: 15 }),
                    },
                });
                testPlans.push(testPlan);
            }
        }

        // 7. Create Test Suites
        console.log('📦 Creating test suites...');
        const testSuites = [];
        const testSuiteCategories = [
            'Login & Authentication',
            'User Management',
            'Payment Processing',
            'Data Validation',
            'Navigation',
            'Search Functionality',
            'Notifications',
            'Reporting',
            'Settings',
            'File Upload',
            'Dashboard',
            'Profile Management',
            'Admin Panel',
            'API Endpoints',
        ];

        for (let i = 0; i < 80; i++) {
            const category = faker.helpers.arrayElement(testSuiteCategories);
            const testSuite = await prisma.testSuite.create({
                data: {
                    name: `${category} Test Suite`,
                    description: faker.lorem.sentence(),
                    createdAt: faker.date.past({ years: 1 }),
                    updatedAt: faker.date.recent({ days: 20 }),
                },
            });
            testSuites.push(testSuite);
        }

        // 8. Create Test Cases
        console.log('🧪 Creating test cases...');
        const testCases = [];
        const testCaseActions = [
            'Login with valid credentials',
            'Login with invalid credentials',
            'Reset password functionality',
            'Create new user account',
            'Update user profile',
            'Delete user account',
            'Upload file',
            'Download file',
            'Search for items',
            'Filter results',
            'Sort data',
            'Navigate between pages',
            'Submit form with valid data',
            'Submit form with invalid data',
            'Process payment',
            'Generate report',
            'Send notification',
            'Change settings',
            'Backup data',
            'Restore data',
        ];

        for (let i = 0; i < 200; i++) {
            const action = faker.helpers.arrayElement(testCaseActions);
            const steps = [];
            const numSteps = faker.number.int({ min: 3, max: 8 });
            for (let j = 0; j < numSteps; j++) {
                steps.push(faker.lorem.sentence());
            }

            const testCase = await prisma.testCase.create({
                data: {
                    name: `${action} - TC${faker.number.int({
                        min: 1000,
                        max: 9999,
                    })}`,
                    description: faker.lorem.sentence(),
                    steps,
                    expectedResult: faker.lorem.paragraph(),
                    createdAt: faker.date.past({ years: 1 }),
                    updatedAt: faker.date.recent({ days: 10 }),
                },
            });
            testCases.push(testCase);
        }

        // 9. Create Test Plan to Test Suite relationships
        console.log('🔗 Linking test plans to test suites...');
        for (const testPlan of testPlans) {
            const linkedSuites = faker.helpers.arrayElements(testSuites, {
                min: 2,
                max: 6,
            });

            for (const suite of linkedSuites) {
                try {
                    await prisma.testPlan_Suites.create({
                        data: {
                            testPlanId: testPlan.id,
                            testSuiteId: suite.id,
                        },
                    });
                } catch (error) {
                    // Skip if relationship already exists
                    if (!error.message.includes('Unique constraint')) {
                        throw error;
                    }
                }
            }
        }

        // 10. Create Test Suite to Test Case relationships
        console.log('🔗 Linking test suites to test cases...');
        for (const testSuite of testSuites) {
            const linkedCases = faker.helpers.arrayElements(testCases, {
                min: 3,
                max: 10,
            });

            for (const testCase of linkedCases) {
                try {
                    await prisma.testSuite_Cases.create({
                        data: {
                            testSuiteId: testSuite.id,
                            testCaseId: testCase.id,
                        },
                    });
                } catch (error) {
                    // Skip if relationship already exists
                    if (!error.message.includes('Unique constraint')) {
                        throw error;
                    }
                }
            }
        }

        // Summary
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`👤 Users: ${users.length}`);
        console.log(`🚀 Projects: ${projects.length}`);
        console.log(`👥 Project Roles: ${createdProjectRoles.length}`);
        console.log(`📝 Permissions: ${createdPermissions.length}`);
        console.log(`📋 Test Plans: ${testPlans.length}`);
        console.log(`📦 Test Suites: ${testSuites.length}`);
        console.log(`🧪 Test Cases: ${testCases.length}`);
        console.log(`🔗 User Project Enrollments: ${enrollments.length}`);

        const totalRecords =
            users.length +
            projects.length +
            createdProjectRoles.length +
            createdPermissions.length +
            testPlans.length +
            testSuites.length +
            testCases.length +
            enrollments.length;

        console.log(`📈 Total records created: ${totalRecords}`);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
});
