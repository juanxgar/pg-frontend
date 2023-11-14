import {
  AuthErrorResponse,
  AuthResponse,
  ErrorResult,
  MessageResult,
  NewPasswordRequest,
  RecoverPasswordRequest,
  SignInRequest,
} from "@/types";
import axios from "axios";
import { environment } from "@/utils";
import { Http } from "@/libs";

class Auth {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }
  signIn(credentials: SignInRequest) {
    return axios.post(`${environment.baseUrl}/auth`, credentials);
  }

  recoverPassword(
    credentials: RecoverPasswordRequest
  ): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/auth/reset-password`, credentials);
  }

  newPassword(
    credentials: NewPasswordRequest
  ): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/auth/new-password`, credentials);
  }
}

export const Authentication = new Auth();
