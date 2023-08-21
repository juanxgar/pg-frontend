import { Http } from "@/libs";
import {
  ErrorResult,
  MessageResult,
  PaginatedResult,
  SpecialityCreationBody,
  SpecialityFilterParams,
  SpecialityItem,
  UpdateSpecialityRequest,
} from "@/types";

class SpecialityServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getAllSpecialitiesWithPagination(
    params: SpecialityFilterParams
  ): Promise<PaginatedResult<SpecialityItem> | ErrorResult> {
    return this.http.get(`/specialities/pagination`, {
      params,
    });
  }

  getAllSpecialities(
    params: SpecialityFilterParams
  ): Promise<Array<SpecialityItem> | ErrorResult> {
    return this.http.get(`/specialities`, {
      params,
    });
  }

  createSpeciality(
    body: SpecialityCreationBody | unknown
  ): Promise<MessageResult | ErrorResult> {
    return this.http.post(`/specialities`, body);
  }

  updateSpeciality(
    request: UpdateSpecialityRequest
  ): Promise<MessageResult | ErrorResult> {
    return this.http.put(
      `/specialities/${request.speciality_id}`,
      request.body
    );
  }

  updateStateSpeciality(
    speciality_id: string
  ): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/specialities/${speciality_id}`);
  }

  deleteSpeciality(
    speciality_id: string
  ): Promise<MessageResult | ErrorResult> {
    return this.http.delete(`/specialities/${speciality_id}`);
  }
}

export const SpecialityService = new SpecialityServices();
