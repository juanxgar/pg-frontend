import { Http } from "@/libs";
import {
  UpdateUserRequest,
  UserCreationBody,
  UserFilterParams,
} from "@/types/request.type";
import { ErrorResult, MessageResult } from "@/types/result.types";

class UserServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getLoggedUser() {
    return this.http.get(`/users/me`);
  }

  getAllProfessorsWithPagination(params: UserFilterParams) {
    return this.http.get(`/users/professors/pagination`, {
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
