export interface Role {
  id: string;
  name: string;
  description?: string;
  restaurantId?: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

import type { PaginatedResponse } from '../../common/types/pagination';

export type PaginatedRolesResponse = PaginatedResponse<Role>;

export interface RoleFilters {
  search?: string;
  isSystem?: boolean;
  isActive?: boolean;
}

