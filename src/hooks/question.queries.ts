import { QuestionService } from "@/services/question.services";
import { DescriptionExamItem } from "@/types";
import { UseQueryResult, useQuery } from "react-query";

export const useQuestion = () => {
  const useQuestions = (): UseQueryResult<
    Array<DescriptionExamItem>,
    unknown
  > => {
    return useQuery(["questions"], () => QuestionService.findQuestions(), {
      refetchOnWindowFocus: false,
      retry: false,
    });
  };

  return {
    useQuestions,
  };
};
