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
  group_id: string;
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

export type SpecialityCreationBody = {
  description: string;
};

export type UpdateSpecialityRequest = {
  speciality_id: string;
  body: SpecialityCreationBody;
};

export type LocationFilterParams = {
  name?: string;
  adress?: string;
  city?: string;
  complexity?: string;
  state?: boolean;
  page?: number;
  limit?: number;
};

export type LocationBody = {
  name: string;
  adress: string;
  city: string;
  total_capacity: number;
  complexity: string;
};

export type LocationCreationBody = LocationBody & {
  specialities: Array<LocationDetailBody>;
};

export type LocationUpdateBody = LocationBody & {
  specialities: Array<LocationDetailUpdateBody>;
};

export type LocationDetailBody = {
  speciality_id: number;
  limit_capacity: number;
};

export type LocationDetailUpdateBody = LocationDetailBody & {
  location_speciality_id: number;
};

export type UpdateLocationRequest = {
  location_id: string;
  body: LocationUpdateBody;
};

export type LocationDetailRequest = {
  location_id: number;
  params?: LocationDetailParams;
};

export type LocationDetailParams = {
  description?: string;
  page?: number;
  limit?: number;
};
