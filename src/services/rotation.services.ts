import { Http } from "@/libs";
import {
  DatesRotationDatesResult,
  ErrorResult,
  MessageResult,
  PaginatedResult,
  RotationCreationBody,
  RotationDateCreationBody,
  RotationFilterParams,
  RotationItem,
  StudentRotationDatesParams,
  UpdateRotationRequest,
  UsedRotationDatesBySpeciality,
} from "@/types";

class RotationServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getAllRotationsWithPagination(
    params: RotationFilterParams
  ): Promise<PaginatedResult<RotationItem> | ErrorResult> {
    return this.http.get(`/rotations/pagination`, {
      params,
    });
  }

  getSpecificRotation(
    rotation_id: string
  ): Promise<RotationItem | ErrorResult> {
    return this.http.get(`/rotations/unique/${rotation_id}`);
  }

  createRotation(
    body: RotationCreationBody | unknown
  ): Promise<MessageResult | ErrorResult> {
    return this.http.post(`/rotations`, body);
  }

  createDateRotation(
    body: RotationDateCreationBody | unknown
  ): Promise<MessageResult | ErrorResult> {
    return this.http.post(`/rotations/dates`, body);
  }

  updateRotation(
    request: UpdateRotationRequest
  ): Promise<MessageResult | ErrorResult> {
    return this.http.put(`/rotations/${request.rotation_id}`, request.body);
  }

  updateStateRotation(
    rotation_id: string
  ): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/rotations/${rotation_id}`);
  }

  deleteRotation(rotation_id: string): Promise<MessageResult | ErrorResult> {
    return this.http.delete(`/rotations/${rotation_id}`);
  }

  getUsedDatesRotations(
    location_id: string
  ): Promise<Array<DatesRotationDatesResult>> {
    return this.http.get(`/rotations/used-dates-rotation/${location_id}`);
  }

  getDatesRotations(
    rotation_id: string
  ): Promise<Array<DatesRotationDatesResult>> {
    return this.http.get(`/rotations/dates-rotation/${rotation_id}`);
  }

  getDatesFromStudent(params: StudentRotationDatesParams) {
    return this.http.get(`/rotations/student-dates`, {
      params,
    });
  }

  getDatesFromStudents(rotation_id: string) {
    return this.http.get(`/rotations/used-dates/${rotation_id}`);
  }

  getUsedDatesFromSpecialities(
    rotation_id: string
  ): Promise<Array<UsedRotationDatesBySpeciality>> {
    return this.http.get(`rotations/specialities-dates/${rotation_id}`);
  }
}

export const RotationService = new RotationServices();
