import * as yup from "yup";

export const RecoverPasswordSchema = (t: any) => {
  return yup.object().shape({
    email: yup
      .string()
      .email(t("user.validations.validEmail"))
      .required(t("commons.validations.requiredField")),
  });
};

export const NewPasswordSchema = (t: any) => {
  return yup.object().shape({
    resetPasswordToken: yup
      .string()
      .required(t("commons.validations.requiredField")),
    password: yup.string().required(t("commons.validations.requiredField")),
    password2: yup.string().required(t("commons.validations.requiredField")),
  });
};
