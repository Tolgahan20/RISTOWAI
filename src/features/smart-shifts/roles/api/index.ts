import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import { buildPaginationParams } from '../../common/utils/pagination';
import type { Role, CreateRoleRequest, UpdateRoleRequest, PaginatedRolesResponse, RoleFilters } from '../types';

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await axiosInstance.get(api.roles.list);
    return response.data;
  },

  getPaginated: async (
    page = 1,
    limit = 20,
    filters?: RoleFilters
  ): Promise<PaginatedRolesResponse> => {
    const params = buildPaginationParams(page, limit, filters);
    const response = await axiosInstance.get(`${api.roles.list}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Role> => {
    const response = await axiosInstance.get(api.roles.byId(id));
    return response.data;
  },

  create: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.post(api.roles.create, data);
    return response.data;
  },

  update: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.patch(api.roles.update(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(api.roles.delete(id));
  },

  deactivate: async (id: string): Promise<Role> => {
    const response = await axiosInstance.patch(api.roles.deactivate(id));
    return response.data;
  },

  activate: async (id: string): Promise<Role> => {
    const response = await axiosInstance.patch(api.roles.activate(id));
    return response.data;
  },
};

