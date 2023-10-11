import { SpecialityItem } from "./entities.type";

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
};

export type MessageResult = {
  message: string;
};

export type ErrorResult = {
  statusCode: number;
  message: string;
};

export type ErrorResultQuery = {
  data: ErrorResult;
  status: number;
};

export type SignInResult = {
  token: string;
  role: string;
};

export type LocationDetailItem = {
  location_speciality_id: number;
  speciality: SpecialityItem;
  limit_capacity: number;
};

export type DatesRotationDatesResult = {
  start_date: string;
  finish_date: string;
};
