import * as yup from "yup";

export const GroupSearchSchema = (t: any) => {
  return yup.object().shape({
    name: yup.string().max(50, t("user.validations.maxSize") + 50),
    professor_user_id: yup.string(),
    state: yup.boolean(),
  });
};

export const GroupCreationSchema = (t: any) => {
  return yup.object().shape({
    name: yup.string().max(50, t("user.validations.maxSize") + 50),
    professor_user_id: yup.string(),
    group_detail: yup.array().required(t("commons.validations.requiredField")),
  });
};
