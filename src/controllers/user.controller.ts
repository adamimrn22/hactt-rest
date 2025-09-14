import { Controller } from '@/controllers/controller';
import { CreateUserDTO } from '@/dto/user.dto';
import { ErrorResponse } from '@/responses';
import { UserService } from '@/services/user.service';
import { HttpStatus } from '@/utils/http-status';
import { Request, Response, NextFunction } from 'express';

export class UserController extends Controller {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    getAllUser = this.asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Extract query params
                const {
                    page = '1',
                    limit = '10',
                    sortBy = 'createdAt',
                    sortOrder = 'desc',
                    email,
                    firstName,
                    lastName,
                } = req.query;

                // Convert query params to appropriate types
                const options = {
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    sortBy: sortBy as
                        | 'createdAt'
                        | 'firstName'
                        | 'lastName'
                        | 'email',
                    sortOrder: sortOrder as 'asc' | 'desc',
                };

                const filters = {
                    email: email as string,
                    firstName: firstName as string,
                    lastName: lastName as string,
                };

                const result = await this.userService.getAllUsers(
                    options,
                    filters
                );
                return this.handleSuccess(
                    res,
                    result,
                    'Users fetched successfully'
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
        }
    );

    createUser = this.asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, role } = req.body as CreateUserDTO;

                await this.userService.createUser({
                    email,
                    role,
                });

                return this.handleSuccess(
                    res,
                    null,
                    'User created successfully',
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
                    ErrorResponse.internal('Failed to create user'),
                    500
                );
            }
        }
    );

    updateUser = this.asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const updatedUser = await this.userService.updateUser(
                    id,
                    updateData
                );
                return this.handleSuccess(
                    res,
                    updatedUser,
                    'User updated successfully'
                );
            } catch (err) {
                if (err instanceof ErrorResponse) {
                    console.log(err.error.code);
                    return this.handleError(
                        res,
                        err,
                        HttpStatus.getStatusCode(err.error.code)
                    );
                }

                return this.handleError(
                    res,
                    ErrorResponse.internal('Failed to update user'),
                    500
                );
            }
        }
    );

    findUser = this.asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { id } = req.params;
                const user = await this.userService.getUserById(id);
                return this.handleSuccess(
                    res,
                    user,
                    'User fetched successfully'
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
                    ErrorResponse.internal('Failed to fetch user'),
                    500
                );
            }
        }
    );

    deleteUser = this.asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { id } = req.params;
                await this.userService.deleteUser(id);
                return this.handleSuccess(
                    res,
                    null,
                    'User deleted successfully'
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
                    ErrorResponse.internal('Failed to delete user'),
                    500
                );
            }
        }
    );
}
