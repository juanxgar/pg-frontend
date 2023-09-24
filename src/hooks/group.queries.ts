import { GroupService } from "@/services";
import {
  ErrorResponse,
  PaginatedResult,
  GroupFilterParams,
  GroupItem,
  MessageResult,
  ErrorResultQuery,
  GroupCreationBody,
  UpdateGroupRequest,
  GroupDetailItem,
  GroupDetailRequest,
} from "@/types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";

export const useGroup = () => {
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const useAllGroupsWithPagination = (
    params: GroupFilterParams
  ): UseQueryResult<PaginatedResult<GroupItem>, unknown> => {
    return useQuery(
      ["groups-pagination-list", params],
      () => GroupService.getAllGroupsWithPagination(params),
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

  const useAllGroups = (
    params: GroupFilterParams
  ): UseQueryResult<Array<GroupItem>, unknown> => {
    return useQuery(
      ["groups-list", params],
      () => GroupService.getAllGroups(params),
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

  const useGroupDetailWithPagination = (
    request: GroupDetailRequest
  ): UseQueryResult<PaginatedResult<GroupDetailItem>, unknown> => {
    return useQuery(
      ["group-detail-pagination-list", request],
      () => GroupService.getGroupDetailWithPagination(request),
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

  const useCreateGroup = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    GroupCreationBody
  > => {
    return useMutation({
      mutationKey: ["add-group"],
      mutationFn: (data: GroupCreationBody) => GroupService.createGroup(data),
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

  const useSpecificGroup = (
    group_id: string
  ): UseQueryResult<GroupItem, unknown> => {
    return useQuery(
      ["specific_group", group_id],
      () => GroupService.getSpecificGroup(group_id),
      {
        refetchOnWindowFocus: false,
        retry: false,
      }
    );
  };

  const useUpdateGroup = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UpdateGroupRequest
  > => {
    return useMutation({
      mutationKey: ["update-group"],
      mutationFn: (request: UpdateGroupRequest) =>
        GroupService.updateGroup(request),
      retry: false,
    });
  };

  const useUpdateStateGroup = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["update-state-group"],
      mutationFn: (group_id: string) => GroupService.updateStateGroup(group_id),
      retry: false,
    });
  };

  const useDeleteGroup = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["delete-group"],
      mutationFn: (group_id: string) => GroupService.deleteGroup(group_id),
      retry: false,
    });
  };

  return {
    errorStatus,
    useAllGroupsWithPagination,
    useSpecificGroup,
    useCreateGroup,
    useUpdateGroup,
    useUpdateStateGroup,
    useDeleteGroup,
    useGroupDetailWithPagination,
    useAllGroups,
  };
};
