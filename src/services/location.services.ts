import { Http } from "@/libs";
import {
  ErrorResult,
  LocationCreationBody,
  LocationDetailItem,
  LocationDetailRequest,
  LocationFilterParams,
  LocationItem,
  MessageResult,
  PaginatedResult,
  UpdateLocationRequest,
} from "@/types";

class LocationsServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getAllLocationsWithPagination(
    params: LocationFilterParams
  ): Promise<PaginatedResult<LocationItem> | ErrorResult> {
    return this.http.get(`/locations/pagination`, {
      params,
    });
  }

  getAllLocations(
    params: LocationFilterParams
  ): Promise<Array<LocationItem> | ErrorResult> {
    return this.http.get(`/locations`, { params });
  }

  getSpecificLocation(
    location_id: string
  ): Promise<LocationItem | ErrorResult> {
    return this.http.get(`/locations/${location_id}`);
  }

  getLocationDetail(
    request: LocationDetailRequest
  ): Promise<Array<LocationDetailItem> | ErrorResult> {
    return this.http.get(`/locations/detail/${request.location_id}`, {
      params: request.params,
    });
  }

  getLocationDetailWithPagination(
    request: LocationDetailRequest
  ): Promise<PaginatedResult<LocationDetailItem> | ErrorResult> {
    return this.http.get(
      `/locations/detail/pagination/${request.location_id}`,
      {
        params: request.params,
      }
    );
  }

  createLocation(
    body: LocationCreationBody | unknown
  ): Promise<MessageResult | ErrorResult> {
    return this.http.post(`/locations`, body);
  }

  updateLocation(
    request: UpdateLocationRequest
  ): Promise<MessageResult | ErrorResult> {
    return this.http.put(`/locations/${request.location_id}`, request.body);
  }

  updateStateLocation(
    location_id: string
  ): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/locations/${location_id}`);
  }

  deleteLocation(location_id: string): Promise<MessageResult | ErrorResult> {
    return this.http.delete(`/locations/${location_id}`);
  }
}

export const LocationService = new LocationsServices();
