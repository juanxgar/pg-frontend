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
