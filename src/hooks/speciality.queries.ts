import { SpecialityService } from "@/services";
import { ErrorResponse, SpecialityItem, SpecialityFilterParams } from "@/types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useQuery, UseQueryResult } from "react-query";

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

  return {
    errorStatus,
    useAllSpecialities,
  };
};
