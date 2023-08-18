export type SignInRequest = {
  email?: string;
  password?: string;
};

export type UserFilterParams = {
  name?: string;
  code?: string;
  email?: string;
  state?: boolean;
  page?: number;
  limit?: number;
};

export type UserCreationBody = {
  name: string;
  lastname: string;
  identification: number;
  role: string;
  code: string;
  email: string;
  password: string;
  speciality_id?: number;
};

export type SpecialityFilterParams = {
  description?: string;
  state?: boolean;
  page?: number;
  limit?: number;
};

export type UpdateUserRequest = {
  user_id: string;
  body: UserCreationBody;
};

export type GroupFilterParams = {
  name?: string;
  professor_user_id?: string;
  state?: boolean;
  page?: number;
  limit?: number;
};

export type GroupCreationBody = {
  name: string;
  professor_user_id: number;
  group_detail: Array<GroupDetailBody>;
};

export type GroupDetailBody = {
  user_id: number;
};

export type UpdateGroupRequest = {
  group_id: number;
  body: GroupCreationBody;
};

export type GroupDetailRequest = {
  group_id: number;
  params?: GroupDetailParams;
};

export type GroupDetailParams = {
  name?: string;
  page?: number;
  limit?: number;
};
