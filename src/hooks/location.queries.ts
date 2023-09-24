import { LocationService } from "@/services";
import {
  ErrorResponse,
  PaginatedResult,
  LocationFilterParams,
  LocationItem,
  MessageResult,
  ErrorResultQuery,
  LocationCreationBody,
  UpdateLocationRequest,
  LocationDetailItem,
  LocationDetailRequest,
} from "@/types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";

export const useLocation = () => {
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const useAllLocationsWithPagination = (
    params: LocationFilterParams
  ): UseQueryResult<PaginatedResult<LocationItem>, unknown> => {
    return useQuery(
      ["locations-pagination-list", params],
      () => LocationService.getAllLocationsWithPagination(params),
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

  const useAllLocations = (
    params: LocationFilterParams
  ): UseQueryResult<Array<LocationItem>, unknown> => {
    return useQuery(
      ["locations-list", params],
      () => LocationService.getAllLocations(params),
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

  const useLocationDetail = (
    request: LocationDetailRequest
  ): UseQueryResult<Array<LocationDetailItem>, unknown> => {
    return useQuery(
      ["location-detail-list", request],
      () => LocationService.getLocationDetail(request),
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

  const useLocationDetailWithPagination = (
    request: LocationDetailRequest
  ): UseQueryResult<PaginatedResult<LocationDetailItem>, unknown> => {
    return useQuery(
      ["location-detail-pagination-list", request],
      () => LocationService.getLocationDetailWithPagination(request),
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

  const useCreateLocation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    LocationCreationBody
  > => {
    return useMutation({
      mutationKey: ["add-location"],
      mutationFn: (data: LocationCreationBody) =>
        LocationService.createLocation(data),
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

  const useSpecificLocation = (
    location_id: string
  ): UseQueryResult<LocationItem, unknown> => {
    return useQuery(
      ["specific_location", location_id],
      () => LocationService.getSpecificLocation(location_id),
      {
        refetchOnWindowFocus: false,
        retry: false,
      }
    );
  };

  const useUpdateLocation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UpdateLocationRequest
  > => {
    return useMutation({
      mutationKey: ["update-location"],
      mutationFn: (request: UpdateLocationRequest) =>
        LocationService.updateLocation(request),
      retry: false,
    });
  };

  const useUpdateStateLocation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["update-state-location"],
      mutationFn: (location_id: string) =>
        LocationService.updateStateLocation(location_id),
      retry: false,
    });
  };

  const useDeleteLocation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    string
  > => {
    return useMutation({
      mutationKey: ["delete-location"],
      mutationFn: (location_id: string) =>
        LocationService.deleteLocation(location_id),
      retry: false,
    });
  };

  return {
    errorStatus,
    useAllLocationsWithPagination,
    useSpecificLocation,
    useCreateLocation,
    useUpdateLocation,
    useUpdateStateLocation,
    useDeleteLocation,
    useLocationDetail,
    useLocationDetailWithPagination,
    useAllLocations,
  };
};
