import {
    CreateProjectDto,
    getAllProjectsResult,
    ProjectFilters,
    ProjectPaginationOptions,
} from '@/dto/project.dto';
import { ProjectRepository } from '@/repositories/project.repository';
import { UserProjectEnrollmentRepository } from '@/repositories/user-project-enrollment.repository';
import { ErrorResponse } from '@/responses';
import { Service } from '@/services/service';
import { Prisma } from '@prisma/client';

export class ProjectService extends Service {
    private projectRepository: ProjectRepository;
    private userProjectEnrollmentRepository: UserProjectEnrollmentRepository;

    constructor() {
        super();
        this.projectRepository = new ProjectRepository(this.prisma);
        this.userProjectEnrollmentRepository =
            new UserProjectEnrollmentRepository(this.prisma);
    }

    // Create a new project
    async createProject(data: CreateProjectDto) {
        try {
            return await this.projectRepository.create(data);
        } catch (error) {
            this.handleServiceError(error, 'ProjectService.createProject');
        }
    }

    // Update an existing project
    async updateProject(
        id: string,
        data: { name?: string; description?: string }
    ) {
        try {
            return await this.projectRepository.update(id, data);
        } catch (error) {
            this.handleServiceError(error, 'ProjectService.updateProject');
        }
    }

    // Get all projects with filters, pagination, sorting
    async getAllProjects(
        options: ProjectPaginationOptions = {},
        filters: ProjectFilters = {}
    ): Promise<getAllProjectsResult> {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options;

        const skip = (page - 1) * limit;

        const where: Prisma.ProjectWhereInput = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                {
                    description: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            ];
        } else {
            // If no search term, check individual filters
            if (filters.name) {
                where.name = { contains: filters.name, mode: 'insensitive' };
            }

            if (filters.description) {
                where.description = {
                    contains: filters.description,
                    mode: 'insensitive',
                };
            }
        }

        const orderBy = { [sortBy]: sortOrder };

        try {
            const [projects, total] = await Promise.all([
                this.projectRepository.findMany(where, {
                    skip,
                    take: limit,
                    orderBy,
                }),
                this.projectRepository.count(where),
            ]);

            if (projects.length === 0) {
                throw ErrorResponse.notFound(
                    'No users found with the given criteria'
                );
            }

            return {
                data: projects,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            this.handleServiceError(error, 'getAllProjects');
        }
    }

    // Get a project by ID
    async getProjectById(id: string) {
        try {
            const project = await this.projectRepository.findById(id);
            if (!project) {
                throw ErrorResponse.notFound('Project not found');
            }
            return project;
        } catch (error) {
            this.handleServiceError(error, 'ProjectService.getProjectById');
        }
    }

    async deleteProject(id: string) {
        try {
            const project = await this.projectRepository.findById(id);
            if (!project) {
                throw ErrorResponse.notFound('Project not found');
            }
            return await this.projectRepository.delete(id);
        } catch (error) {
            this.handleServiceError(error, 'ProjectService.deleteProject');
        }
    }

    async enrollUsersToProject(
        id: string,
        userEnrollments: { userId: string; roleId: string }[]
    ) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw ErrorResponse.notFound('Project not found');
        }

        // Enroll users in the project
        for (const { userId, roleId } of userEnrollments) {
            await this.userProjectEnrollmentRepository.enrollUserInProject(
                project.id,
                userId,
                roleId
            );
        }

        return project;
    }
    async getProjectWithEnrollments(id: string) {
        try {
            const project = await this.projectRepository.findById(id);
            if (!project) {
                throw ErrorResponse.notFound('Project not found');
            }

            const users =
                await this.userProjectEnrollmentRepository.findUsersEnrolledInProject(
                    id
                );

            return { project, users };
        } catch (error) {
            this.handleServiceError(error, 'ProjectService.deleteProject');
        }
    }
}
