import { Authentication } from "@/services";
import {
  ErrorResult,
  ErrorResultQuery,
  MessageResult,
  NewPasswordRequest,
  RecoverPasswordRequest,
} from "@/types";
import { AxiosResponse } from "axios";
import { UseMutateFunction, UseMutationResult, useMutation } from "react-query";

export const useAuth = () => {
  const useRecoverPassword = (): UseMutationResult<
    MessageResult,
    ErrorResult,
    RecoverPasswordRequest,
    unknown
  > => {
    return useMutation({
      mutationKey: ["recover-password"],
      mutationFn: (credentials: RecoverPasswordRequest) =>
        Authentication.recoverPassword(credentials),
      retry: false,
    });
  };

  const useNewPassword = (): UseMutationResult<
    MessageResult,
    ErrorResult,
    NewPasswordRequest,
    unknown
  > => {
    return useMutation({
      mutationKey: ["new-password"],
      mutationFn: (credentials: NewPasswordRequest) =>
        Authentication.newPassword(credentials),
      retry: false,
    });
  };

  return {
    useRecoverPassword,
    useNewPassword,
  };
};
