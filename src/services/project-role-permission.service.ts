import { Prisma } from '@prisma/client';
import { Service } from '@/services/service';
import { ProjectRolePermissionRepository } from '@/repositories/project-role-permission.repository';

export class ProjectRolePermissionService extends Service {
    private projectRolePermissionRepository: ProjectRolePermissionRepository;

    constructor() {
        super();
        this.projectRolePermissionRepository =
            new ProjectRolePermissionRepository(this.prisma);
    }

    async createRolePermission(data: Prisma.ProjectRolePermissionCreateInput) {
        return await this.projectRolePermissionRepository.create(data);
    }

    async getAllRolePermissions() {
        return await this.projectRolePermissionRepository.findMany();
    }

    async getRolePermissionById(id: string) {
        return await this.projectRolePermissionRepository.findById(id);
    }

    async deleteRolePermission(id: string) {
        await this.projectRolePermissionRepository.delete(id);
        return { message: 'RolePermission deleted successfully' };
    }
}
