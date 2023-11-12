import * as yup from "yup";

export const RotationSearchSchema = (t: any) => {
  return yup.object().shape({
    groupIdSearch: yup.number(),
    locationIdSearch: yup.number(),
    startDateSearch: yup.string(),
    finishDateSearch: yup.string(),
    semesterSearch: yup.number(),
  });
};

export const RotationCreationSchema = (t: any) => {
  return yup.object().shape({
    finish_date: yup.string().required(t("commons.validations.requiredField")),
    group_id: yup
      .number()
      .min(1, "The minimum amount is 1")
      .max(12, t("user.validations.maxSize") + 12)
      .required(t("commons.validations.requiredField"))
      .positive()
      .moreThan(0, t("commons.validations.requiredField")),
    location_id: yup
      .number()
      .min(1, "The minimum amount is 1")
      .max(12, t("user.validations.maxSize") + 12)
      .required(t("commons.validations.requiredField"))
      .positive()
      .moreThan(0, t("commons.validations.requiredField")),
    semester: yup
      .number()
      .min(1, "The minimum amount is 1")
      .max(12, t("user.validations.maxSize") + 12)
      .required(t("commons.validations.requiredField"))
      .positive()
      .moreThan(0, t("commons.validations.requiredField")),
    specialities: yup.array().required(t("commons.validations.requiredField")),
    start_date: yup.string().required(t("commons.validations.requiredField")),
  });
};

export const RotationDateCreationSchema = (t: any) => {
  return yup.object().shape({
    rotation_id: yup.number(),
    student_user_id: yup.number(),
    rotation_dates: yup.array().of(
      yup.object().shape({
        rotation_speciality_id: yup
          .number()
          .required(t("commons.validations.requiredField")),
        start_date: yup
          .string()
          .required(t("commons.validations.requiredField")),
        finish_date: yup
          .string()
          .required(t("commons.validations.requiredField")),
      })
    ),
  });
};
