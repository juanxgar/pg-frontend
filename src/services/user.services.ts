import { Http } from "@/libs";
import {
  UpdateUserRequest,
  UserCreationBody,
  UserFilterParams,
  ErrorResult,
  MessageResult,
  PaginatedResult,
  ProfessorItem,
  UserItem,
  StudentItem,
} from "@/types";

class UserServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getLoggedUser(): Promise<UserItem | ErrorResult> {
    return this.http.get(`/users/me`);
  }

  getAllProfessorsWithPagination(
    params: UserFilterParams
  ): Promise<PaginatedResult<ProfessorItem> | ErrorResult> {
    return this.http.get(`/users/professors/pagination`, {
      params,
    });
  }

  getAllProfessors(
    params: UserFilterParams
  ): Promise<Array<ProfessorItem> | ErrorResult> {
    return this.http.get(`/users/professors`, {
      params,
    });
  }

  getAllStudentsWithPagination(
    params: UserFilterParams
  ): Promise<PaginatedResult<StudentItem> | ErrorResult> {
    return this.http.get(`/users/students/pagination`, {
      params,
    });
  }

  getAllStudents(
    params: UserFilterParams
  ): Promise<Array<StudentItem> | ErrorResult> {
    return this.http.get(`/users/students`, {
      params,
    });
  }

  createUser(
    body: UserCreationBody | unknown
  ): Promise<MessageResult | ErrorResult> {
    return this.http.post(`/users`, body);
  }

  updateUser(request: UpdateUserRequest): Promise<MessageResult | ErrorResult> {
    return this.http.put(`/users/${request.user_id}`, request.body);
  }

  updateStateUser(user_id: string): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/users/${user_id}`);
  }

  deleteUser(user_id: string): Promise<MessageResult | ErrorResult> {
    return this.http.delete(`/users/${user_id}`);
  }
}

export const UserService = new UserServices();
