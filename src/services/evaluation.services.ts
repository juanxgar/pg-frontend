import { Http } from "@/libs";
import {
  ErrorResult,
  EvaluationCreatedResult,
  EvaluationCreationBody,
  EvaluationParams,
  MessageResult,
  UpdateEvaluationRequest,
} from "@/types";

class EvaluationsServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  createEvaluation(body: EvaluationCreationBody): Promise<MessageResult> {
    return this.http.post(`/evaluations`, body);
  }

  updateEvaluation(request: UpdateEvaluationRequest): Promise<MessageResult> {
    return this.http.put(`/evaluations/${request.evaluation_id}`, request.body);
  }

  findBySpecialityAndStudent(
    params: EvaluationParams
  ): Promise<EvaluationCreatedResult | ErrorResult> {
    return this.http.get(`/evaluations/speciality-student`, { params });
  }
}

export const EvaluationService = new EvaluationsServices();
