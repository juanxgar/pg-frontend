import { EvaluationService } from "@/services/evaluation.services";
import {
  ErrorResult,
  ErrorResultQuery,
  EvaluationCreatedResult,
  EvaluationCreationBody,
  EvaluationParams,
  MessageResult,
  UpdateEvaluationRequest,
} from "@/types";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";

export const useEvaluation = () => {
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const useSpecificEvaluationBySpecialityAndStudent = (
    params: EvaluationParams
  ): UseQueryResult<EvaluationCreatedResult, ErrorResult> => {
    return useQuery(
      ["specific_evaluation", params],
      () => EvaluationService.findBySpecialityAndStudent(params),
      {
        refetchOnWindowFocus: false,
        retry: false,
        enabled: false,
      }
    );
  };

  const useCreateEvaluation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    EvaluationCreationBody
  > => {
    return useMutation({
      mutationKey: ["add-evaluation"],
      mutationFn: (data: EvaluationCreationBody) =>
        EvaluationService.createEvaluation(data),
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

  const useUpdateEvaluation = (): UseMutationResult<
    MessageResult,
    ErrorResultQuery,
    UpdateEvaluationRequest
  > => {
    return useMutation({
      mutationKey: ["update-evaluation"],
      mutationFn: (request: UpdateEvaluationRequest) =>
        EvaluationService.updateEvaluation(request),
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

  return {
    errorStatus,
    useSpecificEvaluationBySpecialityAndStudent,
    useCreateEvaluation,
    useUpdateEvaluation,
  };
};
