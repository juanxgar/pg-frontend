import { SignInRequest } from "@/types/request.type";
import axios from "axios";
import { environment } from "@/utils";

class Auth {
  signIn(credentials: SignInRequest) {
    return axios.post(`${environment.baseUrl}/auth`, credentials);
  }
}

export const Authentication = new Auth();
