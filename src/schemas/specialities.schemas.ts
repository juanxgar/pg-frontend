import * as yup from "yup";

export const SpecialitySearchSchema = (t: any) => {
  return yup.object().shape({
    description: yup.string().max(50, t("user.validations.maxSize") + 50),
    state: yup.boolean(),
  });
};

export const SpecialityCreationSchema = (t: any) => {
  return yup.object().shape({
    description: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
  });
};
