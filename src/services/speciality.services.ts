import { Http } from "@/libs";
import { SpecialityFilterParams } from "@/types/request.type";

class SpecialityServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getAllSpecialities(params: SpecialityFilterParams) {
    return this.http.get(`/specialities`, {
      params,
    });
  }
}

export const SpecialityService = new SpecialityServices();
