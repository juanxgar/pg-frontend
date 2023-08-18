import { UserService } from "@/services";
import {
  ProfessorItem,
  StudentItem,
  UserItem,
  ErrorResponse,
  ErrorResultQuery,
  MessageResult,
  PaginatedResult,
  UpdateUserRequest,
  UserCreationBody,
  UserFilterParams,
} from "@/types";
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

  const useAllProfessors = (
    params: UserFilterParams
  ): UseQueryResult<Array<ProfessorItem>, unknown> => {
    return useQuery(
      ["professors-list", params],
      () => UserService.getAllProfessors(params),
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

  const useAllStudentsWithPagination = (
    params: UserFilterParams
  ): UseQueryResult<PaginatedResult<StudentItem>, unknown> => {
    return useQuery(
      ["students-pagination-list", params],
      () => UserService.getAllStudentsWithPagination(params),
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

  const useAllStudents = (
    params: UserFilterParams
  ): UseQueryResult<Array<StudentItem>> => {
    return useQuery(
      ["students-list", params],
      () => UserService.getAllStudents(params),
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
      onError(err: ErrorResultQuery) {
        if (err.status === 401) {
          setErrorStatus(401);
          setTimeout(() => {
            signOut();
          }, 3000);
        }
      },
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
    useAllStudentsWithPagination,
    useCreateUser,
    useUpdateUser,
    useUpdateStateUser,
    useDeleteUser,
    useAllProfessors,
    useAllStudents,
  };
};
