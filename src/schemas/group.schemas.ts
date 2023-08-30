import * as yup from "yup";

export const GroupSearchSchema = (t: any) => {
  return yup.object().shape({
    nameSearch: yup.string().max(50, t("user.validations.maxSize") + 50),
    professorSearch: yup.string(),
    stateSearch: yup.boolean(),
  });
};

export const GroupCreationSchema = (t: any) => {
  return yup.object().shape({
    name: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    professor_user_id: yup
      .string()
      .required(t("commons.validations.requiredField")),
    group_detail: yup.array().required(t("commons.validations.requiredField")),
  });
};
