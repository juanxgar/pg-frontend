import * as yup from "yup";

export const LoginSchema = (t: any) => {
  return yup.object().shape({
    email: yup
      .string()
      .email(t("user.validations.validEmail"))
      .required(t("commons.validations.requiredField")),
    password: yup.string().required(t("commons.validations.requiredField")),
  });
};
