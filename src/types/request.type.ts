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
};

export type UpdateUserRequest = {
  user_id: string;
  body: UserCreationBody;
};
