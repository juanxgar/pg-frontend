import * as yup from "yup";

export const LocationSearchSchema = (t: any) => {
  return yup.object().shape({
    nameSearch: yup.string().max(50, t("user.validations.maxSize") + 50),
    adressSearch: yup.string().max(50, t("user.validations.maxSize") + 50),
    citySearch: yup.string().max(50, t("user.validations.maxSize") + 50),
    complexitySearch: yup.string().max(50, t("user.validations.maxSize") + 50),
    stateSearch: yup.boolean(),
  });
};

export const LocationCreationSchema = (t: any) => {
  return yup.object().shape({
    name: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    adress: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    city: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    total_capacity: yup
      .number()
      .integer()
      .positive()
      .min(1, t("user.validations.minSize") + 1)
      .max(999, t("user.validations.maxSize") + 999)
      .required(t("commons.validations.requiredField")),
    complexity: yup
      .string()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
    specialities: yup
      .array()
      .of(
        yup.object().shape({
          speciality_id: yup
            .number()
            .required(t("commons.validations.requiredField")),
          limit_capacity: yup
            .number()
            .required(t("commons.validations.requiredField")),
        })
      )
      .required(t("commons.validations.requiredField")),
  });
};

export const LocationSpecialitiesCreationSchema = (t: any) => {
  return yup.object().shape({
    speciality_id: yup
      .number()
      .required(t("commons.validations.requiredField")),
    limit_capacity: yup
      .number()
      .max(50, t("user.validations.maxSize") + 50)
      .required(t("commons.validations.requiredField")),
  });
};
