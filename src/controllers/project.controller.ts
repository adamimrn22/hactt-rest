import { Controller } from '@/controllers/controller';
import { CreateProjectDto, UpdateProjectDto } from '@/dto/project.dto';
import { ErrorResponse } from '@/responses';
import { ProjectService } from '@/services/project.service';
import { HttpStatus } from '@/utils/http-status';

export class ProjectController extends Controller {
    private projectService: ProjectService;

    constructor() {
        super();
        this.projectService = new ProjectService();
    }

    getAllProjects = this.asyncHandler(async (req, res, next) => {
        try {
            // Extract query params
            const {
                page = '1',
                limit = '10',
                sortBy = 'createdAt',
                sortOrder = 'desc',
                search,
            } = req.query;

            // Convert query params to appropriate types
            const options = {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                sortBy: sortBy as 'name' | 'description',
                sortOrder: sortOrder as 'asc' | 'desc',
            };

            const filters = {
                search: search as string,
                name: req.query.name as string,
                description: req.query.description as string,
            };

            const result = await this.projectService.getAllProjects(
                options,
                filters
            );
            return this.handleSuccess(
                res,
                result,
                'Projects fetched successfully'
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }

            return this.handleError(
                res,
                ErrorResponse.internal('Failed to fetch users'),
                500
            );
        }
    });

    createProject = this.asyncHandler(async (req, res, next) => {
        try {
            const project: CreateProjectDto = req.body as CreateProjectDto;
            const newProject = await this.projectService.createProject(project);
            return this.handleSuccess(
                res,
                newProject,
                'Project created successfully',
                201
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }
            return this.handleError(
                res,
                ErrorResponse.internal('Failed to create project'),
                500
            );
        }
    });

    getProjectById = this.asyncHandler(async (req, res, next) => {
        try {
            const { id } = req.params;
            const project = await this.projectService.getProjectById(id);
            return this.handleSuccess(
                res,
                project,
                'Project fetched successfully'
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }
            return this.handleError(
                res,
                ErrorResponse.internal('Failed to fetch project'),
                500
            );
        }
    });

    updateProject = this.asyncHandler(async (req, res, next) => {
        try {
            const { id } = req.params;
            const updates: UpdateProjectDto = req.body;
            const updatedProject = await this.projectService.updateProject(
                id,
                updates
            );
            return this.handleSuccess(
                res,
                updatedProject,
                'Project updated successfully'
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }
            return this.handleError(
                res,
                ErrorResponse.internal('Failed to update project'),
                500
            );
        }
    });

    deleteProject = this.asyncHandler(async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.projectService.deleteProject(id);
            return this.handleSuccess(
                res,
                null,
                'Project deleted successfully'
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }
            return this.handleError(
                res,
                ErrorResponse.internal('Failed to delete project'),
                500
            );
        }
    });

    enrollUsersToProject = this.asyncHandler(async (req, res, next) => {
        try {
            const { id } = req.params;
            const userEnrollments: { userId: string; roleId: string }[] =
                req.body;
            const project = await this.projectService.enrollUsersToProject(
                id,
                userEnrollments
            );
            return this.handleSuccess(
                res,
                project,
                'Users enrolled to project successfully'
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }
            return this.handleError(
                res,
                ErrorResponse.internal('Failed to enroll users to project'),
                500
            );
        }
    });
}
