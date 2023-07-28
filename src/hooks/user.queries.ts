import { UserService } from "@/services/user.services";
import { ErrorResponse } from "@/types/common.type";
import { ProfessorItem, UserItem } from "@/types/entities.type";
import {
  UpdateUserRequest,
  UserCreationBody,
  UserFilterParams,
} from "@/types/request.type";
import {
  ErrorResultQuery,
  MessageResult,
  PaginatedResult,
} from "@/types/result.types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";

export const useUser = () => {
  const [errorStatus, setErrorStatus] = useState(0);

  const useAllProfessorsWithPagination = (
    params: UserFilterParams
  ): UseQueryResult<PaginatedResult<ProfessorItem>, unknown> => {
    return useQuery(
      ["professors-pagination-list", params],
      () => UserService.getAllProfessorsWithPagination(params),
      {
        refetchOnWindowFocus: false,
        retry: false,
        onError(err: ErrorResponse) {
          if (err.status === 401) {
            setErrorStatus(401);
            setTimeout(() => {
              signOut();
            }, 3000);
          }
        },
      }
    );
  };

  const useLoggedUser = (): UseQueryResult<UserItem, unknown> => {
    return useQuery(["logged-user"], () => UserService.getLoggedUser(), {
      refetchOnWindowFocus: false,
      retry: true,
      onError(err: ErrorResponse) {
        if (err.status === 401) {
          setErrorStatus(401);
          setTimeout(() => {
            signOut();
          }, 3000);
        }
      },
    });
  };

  const useCreateUser = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UserCreationBody
  > => {
    return useMutation({
      mutationKey: ["add-user"],
      mutationFn: (data: UserCreationBody) => UserService.createUser(data),
      retry: false,
    });
  };

  const useUpdateUser = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UpdateUserRequest
  > => {
    return useMutation({
      mutationKey: ["update-user"],
      mutationFn: (request: UpdateUserRequest) =>
        UserService.updateUser(request),
      retry: false,
    });
  };

  const useUpdateStateUser = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["update-state-user"],
      mutationFn: (user_id: string) => UserService.updateStateUser(user_id),
      retry: false,
    });
  };

  const useDeleteUser = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["delete-user"],
      mutationFn: (user_id: string) => UserService.deleteUser(user_id),
      retry: false,
    });
  };

  return {
    errorStatus,
    useLoggedUser,
    useAllProfessorsWithPagination,
    useCreateUser,
    useUpdateUser,
    useUpdateStateUser,
    useDeleteUser,
  };
};
