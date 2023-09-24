import { RotationService } from "@/services";
import {
  ErrorResponse,
  PaginatedResult,
  RotationFilterParams,
  RotationItem,
  MessageResult,
  ErrorResultQuery,
  RotationCreationBody,
  UpdateRotationRequest,
} from "@/types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";

export const useRotation = () => {
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const useAllRotationsWithPagination = (
    params: RotationFilterParams
  ): UseQueryResult<PaginatedResult<RotationItem>, unknown> => {
    return useQuery(
      ["rotations-pagination-list", params],
      () => RotationService.getAllRotationsWithPagination(params),
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

  const useCreateRotation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    RotationCreationBody
  > => {
    return useMutation({
      mutationKey: ["add-rotation"],
      mutationFn: (data: RotationCreationBody) =>
        RotationService.createRotation(data),
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

  const useSpecificRotation = (
    rotation_id: string
  ): UseQueryResult<RotationItem, unknown> => {
    return useQuery(
      ["specific_rotation", rotation_id],
      () => RotationService.getSpecificRotation(rotation_id),
      {
        refetchOnWindowFocus: false,
        retry: false,
      }
    );
  };

  const useUpdateRotation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UpdateRotationRequest
  > => {
    return useMutation({
      mutationKey: ["update-rotation"],
      mutationFn: (request: UpdateRotationRequest) =>
        RotationService.updateRotation(request),
      retry: false,
    });
  };

  const useDeleteRotation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["delete-rotation"],
      mutationFn: (rotation_id: string) =>
        RotationService.deleteRotation(rotation_id),
      retry: false,
    });
  };

  return {
    errorStatus,
    useAllRotationsWithPagination,
    useSpecificRotation,
    useCreateRotation,
    useUpdateRotation,
    useDeleteRotation,
  };
};
