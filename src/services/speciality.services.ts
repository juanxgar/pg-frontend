import { Http } from "@/libs";
import { ErrorResult, SpecialityFilterParams, SpecialityItem } from "@/types";

class SpecialityServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getAllSpecialities(
    params: SpecialityFilterParams
  ): Promise<Array<SpecialityItem> | ErrorResult> {
    return this.http.get(`/specialities`, {
      params,
    });
  }
}

export const SpecialityService = new SpecialityServices();
