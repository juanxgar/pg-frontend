import { SpecialityService } from "@/services";
import {
  ErrorResponse,
  SpecialityItem,
  SpecialityFilterParams,
  PaginatedResult,
  MessageResult,
  ErrorResultQuery,
  SpecialityCreationBody,
  UpdateSpecialityRequest,
} from "@/types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";

export const useSpeciality = () => {
  const [errorStatus, setErrorStatus] = useState(0);

  const useAllSpecialities = (
    params: SpecialityFilterParams
  ): UseQueryResult<Array<SpecialityItem>, unknown> => {
    return useQuery(
      ["speciality-list"],
      () => SpecialityService.getAllSpecialities(params),
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

  const useAllSpecialitiesWithPagination = (
    params: SpecialityFilterParams
  ): UseQueryResult<PaginatedResult<SpecialityItem>, unknown> => {
    return useQuery(
      ["specialities-pagination-list", params],
      () => SpecialityService.getAllSpecialitiesWithPagination(params),
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

  const useCreateSpeciality = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    SpecialityCreationBody
  > => {
    return useMutation({
      mutationKey: ["add-speciality"],
      mutationFn: (data: SpecialityCreationBody) =>
        SpecialityService.createSpeciality(data),
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

  const useUpdateSpeciality = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UpdateSpecialityRequest
  > => {
    return useMutation({
      mutationKey: ["update-speciality"],
      mutationFn: (request: UpdateSpecialityRequest) =>
        SpecialityService.updateSpeciality(request),
      retry: false,
    });
  };

  const useUpdateStateSpeciality = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["update-state-speciality"],
      mutationFn: (group_id: string) =>
        SpecialityService.updateStateSpeciality(group_id),
      retry: false,
    });
  };

  const useDeleteSpeciality = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["delete-speciality"],
      mutationFn: (group_id: string) =>
        SpecialityService.deleteSpeciality(group_id),
      retry: false,
    });
  };

  return {
    errorStatus,
    useAllSpecialities,
    useAllSpecialitiesWithPagination,
    useCreateSpeciality,
    useDeleteSpeciality,
    useUpdateSpeciality,
    useUpdateStateSpeciality,
  };
};
