import * as yup from "yup";

export const UserSearchSchema = (t: any) => {
  return yup.object().shape({
    name: yup.string().max(50, t("user.validations.maxSize") + 50),
    email: yup.string().max(50, t("user.validations.maxSize") + 50),
    code: yup.string().max(50, t("user.validations.maxSize") + 50),
    state: yup.boolean(),
  });
};

export const ProfessorCreationSchema = (t: any) => {
  return yup.object().shape({
    name: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    lastname: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    identification: yup
      .number()
      .min(100000, t("user.validations.minSize") + 6)
      .max(999999999999, t("user.validations.maxSize") + 12)
      .required(t("commons.validations.requiredField")),
    code: yup
      .string()
      .max(20, t("user.validations.maxSize") + 20)
      .required(t("commons.validations.requiredField")),
    email: yup
      .string()
      .email(t("user.validations.validEmail"))
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    password: yup
      .string()
      .max(20, t("user.validations.maxSize") + 20)
      .required(t("commons.validations.requiredField")),
    speciality_id: yup
      .number()
      .min(1, t("user.selectSpeciality"))
      .required(t("commons.validations.requiredField")),
  });
};

export const StudentCreationSchema = (t: any) => {
  return yup.object().shape({
    name: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    lastname: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    identification: yup
      .number()
      .min(100000, t("user.validations.minSize") + 6)
      .max(999999999999, t("user.validations.maxSize") + 12)
      .required(t("commons.validations.requiredField")),
    code: yup
      .string()
      .max(20, t("user.validations.maxSize") + 20)
      .required(t("commons.validations.requiredField")),
    email: yup
      .string()
      .email(t("user.validations.validEmail"))
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    password: yup
      .string()
      .max(20, t("user.validations.maxSize") + 20)
      .required(t("commons.validations.requiredField")),
  });
};
