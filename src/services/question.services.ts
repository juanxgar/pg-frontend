import { Http } from "@/libs";
import { DescriptionExamItem } from "@/types";

class QuestionsServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  findQuestions(): Promise<Array<DescriptionExamItem>> {
    return this.http.get(`/questions`);
  }
}

export const QuestionService = new QuestionsServices();
