import { Http } from "@/libs";
import {
  ErrorResult,
  MessageResult,
  PaginatedResult,
  RotationCreationBody,
  RotationFilterParams,
  RotationItem,
  UpdateRotationRequest,
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
}

export const RotationService = new RotationServices();
