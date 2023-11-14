import * as yup from "yup";

export const EvaluationSearchSchema = (t: any) => {
  return yup.object().shape({
    group_id: yup.number().required(t("commons.validations.requiredField")),
    student_user_id: yup
      .number()
      .required(t("commons.validations.requiredField")),
    date: yup.string().required(t("commons.validations.requiredField")),
    rotation_speciality_id: yup
      .number()
      .required(t("commons.validations.requiredField")),
  });
};

export const EvaluationCreationSchema = (t: any) => {
  return yup.object().shape({
    professor_comments: yup.string(),
    student_comments: yup.string(),
    student_grades: yup.array().of(
      yup.object().shape({
        subdescription_exam_id: yup.number(),
        student_grade_id: yup.number(),
        grade_value: yup
          .number()
          .required(t("commons.validations.requiredField")),
      })
    ),
  });
};
