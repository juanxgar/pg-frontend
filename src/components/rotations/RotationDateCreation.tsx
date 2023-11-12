import { CancelButton, EditButton, InputDateComponent } from "@/components";
import { useRotation } from "@/hooks";
import { RotationDateCreationSchema } from "@/schemas";
import {
  DatesRotationDatesResult,
  FormikRotationDateCreation,
  FormikRotationDateCreationDates,
  FormikRotationDates,
  RotationDateCreationBody,
  RotationDateCreationDatesBody,
  RotationItem,
  RotationSpecialityItem,
  StudentRotation,
  StudentRotationDatesResult,
  UsedRotationDatesBySpeciality,
  UserItem,
} from "@/types";
import { AlertColor, Box, Grid, Typography } from "@mui/material";
import { FieldArray, Form, Formik, FormikErrors, FormikTouched } from "formik";
import moment, { Moment } from "moment";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect } from "react";

interface Props {
  toggleDrawer: () => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (openSnackbar: boolean) => void;
  refetch: () => void;
  refetchStudentsDates: () => void;
  checked: Array<boolean>;
  setChecked: (cheked: Array<boolean>) => void;
  updateChecked: () => void;
  student?: StudentRotation;
  dataRotation?: RotationItem;
  dataUsedDatesSpecialities?: Array<UsedRotationDatesBySpeciality>;
  isLoadingRotationDates: boolean;
  dataRotationDates?: Array<StudentRotationDatesResult>;
  initialValues: FormikRotationDateCreation;
  dataDates?: Array<DatesRotationDatesResult>;
}

export function RotationDateCreation(props: Props): ReactElement {
  const {
    toggleDrawer,
    refetch,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    checked,
    setChecked,
    updateChecked,
    student,
    dataRotation,
    dataUsedDatesSpecialities,
    isLoadingRotationDates,
    dataRotationDates,
    initialValues,
    dataDates,
    refetchStudentsDates,
  } = props;

  const t = useTranslations();

  const { useCreateDateRotation, errorStatus } = useRotation();

  const {
    mutate,
    isSuccess,
    data: dataCreation,
    isLoading: isLoadingCreation,
    isError,
    error,
  } = useCreateDateRotation();

  const disableUsedDates = (
    date: Moment,
    rotation_speciality_id: number,
    initialStartDate: Moment | null,
    initialFinishDate: Moment | null,
    isStartDate: boolean,
    prevStartDate: Moment | null,
    prevFinishDate: Moment | null
  ): boolean => {
    const disableDates: Array<Moment> = [];

    if (dataDates) {
      dataDates.forEach((d: DatesRotationDatesResult) => {
        for (let i = 1; i <= 6; i++) {
          if (isStartDate) {
            if (date.isSame(moment(d.start_date).add(i, "days"))) {
              disableDates.push(date);
            }
          } else {
            if (date.isSame(moment(d.finish_date).subtract(i, "days"))) {
              disableDates.push(date);
            }
          }
        }
        if (date.isAfter(dataDates[dataDates.length - 1].finish_date)) {
          disableDates.push(date);
        }
      });
    }

    if (dataUsedDatesSpecialities) {
      dataUsedDatesSpecialities.forEach(
        (data: UsedRotationDatesBySpeciality) => {
          if (data.rotation_speciality_id === rotation_speciality_id) {
            if (data.used_dates.length > 0) {
              data.used_dates.forEach((d: DatesRotationDatesResult) => {
                if (
                  date.isBetween(
                    moment(d.start_date).subtract(1, "days"),
                    moment(d.finish_date).add(1, "days")
                  )
                ) {
                  if (
                    (!initialStartDate ||
                      !initialStartDate?.isSame(moment(d.start_date))) &&
                    (!initialFinishDate ||
                      !initialFinishDate?.isSame(moment(d.finish_date)))
                  ) {
                    disableDates.push(date);
                  }
                }
              });
            }
          }
        }
      );
    }

    if (isStartDate) {
      if (prevStartDate != null && prevStartDate.isSame(date)) {
        disableDates.push(date);
      }
    } else {
      if (prevFinishDate != null && prevFinishDate.isSame(date)) {
        disableDates.push(date);
      }
    }

    if (prevStartDate != null && prevFinishDate != null) {
      if (date.isBetween(prevStartDate, prevFinishDate)) {
        disableDates.push(date);
      }
    }

    if (date.isBefore(prevStartDate)) {
      disableDates.push(date);
    }

    return disableDates.includes(date);
  };

  const onSubmit = (values: FormikRotationDateCreation) => {
    const rotation_dates: Array<RotationDateCreationDatesBody> =
      values.rotation_dates.map((dates: FormikRotationDateCreationDates) => {
        return {
          rotation_speciality_id: dates.rotation_speciality_id,
          start_date: dates.start_date?.format("YYYY-MM-DD") || "",
          finish_date: dates.finish_date?.format("YYYY-MM-DD") || "",
        };
      });
    const body: RotationDateCreationBody = {
      rotation_id: values.rotation_id,
      student_user_id: values.student_user_id,
      rotation_dates,
    };
    mutate(body);
  };

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataCreation.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
      refetchStudentsDates();
      checked.push(false);
      setChecked(checked);
      updateChecked();
    }
  }, [isLoadingCreation]);

  useEffect(() => {
    if (isError) {
      if (error.status === 400) {
        setMessageSnackbar(error.data.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
  }, [isError]);

  useEffect(() => {
    if (errorStatus === 401) {
      setMessageSnackbar(t("commons.sessionExpired"));
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
  }, [errorStatus]);

  return (
    <>
      {!isLoadingRotationDates &&
        dataRotationDates &&
        initialValues.rotation_dates.length > 0 && (
          <Formik
            initialValues={initialValues}
            validationSchema={RotationDateCreationSchema(t)}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({
              errors,
              values,
              touched,
              setFieldValue,
            }: {
              errors: FormikErrors<FormikRotationDateCreation>;
              values: FormikRotationDateCreation;
              touched: FormikTouched<FormikRotationDateCreation>;
              setFieldValue: (
                field: string,
                value: any,
                shouldValidate?: boolean | undefined
              ) => Promise<void | FormikErrors<FormikRotationDateCreation>>;
            }) => (
              <Box sx={{ width: { xs: "325px", lg: "500px" } }}>
                <Typography
                  sx={{
                    textAlign: "left",
                    fontSize: "20px",
                    marginLeft: "20px",
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  {t("commons.updateForm")}
                </Typography>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    <Box
                      sx={{
                        marginLeft: "20px",
                        marginTop: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      <Typography fontSize={{ lg: 20, xs: 16 }}>
                        <strong>{t("rotations.studentName")}: </strong>
                        {student?.name} {student?.lastname}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Form>
                  <FieldArray name="rotation_dates">
                    {() =>
                      dataRotation?.rotation_speciality?.map(
                        (speciality: RotationSpecialityItem, i: number) => {
                          return (
                            <Grid
                              container
                              key={speciality.rotation_speciality_id}
                            >
                              <Grid item lg={3} xs={12}>
                                <Box
                                  sx={{
                                    float: { lg: "right", xs: "left" },
                                    marginTop: { lg: "15px", xs: "0px" },
                                  }}
                                >
                                  <Typography fontSize={{ lg: 16, xs: 12 }}>
                                    <strong>
                                      {speciality.speciality.description}:{" "}
                                    </strong>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item lg={4.5} xs={12}>
                                <InputDateComponent
                                  value={moment(
                                    values.rotation_dates[i]
                                      ? values.rotation_dates[i].start_date
                                      : ""
                                  )}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rotation_dates.${i}.start_date`,
                                      e
                                    )
                                  }
                                  disabled={
                                    (i != 0 &&
                                      values.rotation_dates[i - 1].start_date !=
                                        null) ||
                                    i === 0
                                      ? false
                                      : true
                                  }
                                  shouldDisableDate={(date: Moment) =>
                                    disableUsedDates(
                                      date,
                                      values.rotation_dates[i]
                                        .rotation_speciality_id,
                                      initialValues.rotation_dates[i]
                                        .start_date,
                                      initialValues.rotation_dates[i]
                                        .finish_date,
                                      true,
                                      i != 0 &&
                                        values.rotation_dates[0].start_date !=
                                          null
                                        ? values.rotation_dates[0].start_date
                                        : null,
                                      i != 0 &&
                                        values.rotation_dates[i - 1]
                                          .finish_date != null
                                        ? values.rotation_dates[i - 1]
                                            .finish_date
                                        : null
                                    )
                                  }
                                  minDate={moment(dataRotation.start_date).add(
                                    1,
                                    "day"
                                  )}
                                  maxDate={moment(dataRotation.finish_date).add(
                                    1,
                                    "day"
                                  )}
                                  label={t("rotations.startDate")}
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      id: `rotation_dates.${i}.start_date`,
                                      name: `rotation_dates.${i}.start_date`,
                                    },
                                  }}
                                />
                              </Grid>
                              <Grid item lg={4.5} xs={12}>
                                <InputDateComponent
                                  value={moment(
                                    values.rotation_dates[i]
                                      ? values.rotation_dates[i].finish_date
                                      : ""
                                  )}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rotation_dates.${i}.finish_date`,
                                      e
                                    )
                                  }
                                  disabled={
                                    (i != 0 &&
                                      values.rotation_dates[i - 1].start_date !=
                                        null) ||
                                    i === 0
                                      ? false
                                      : true
                                  }
                                  shouldDisableDate={(date: Moment) =>
                                    disableUsedDates(
                                      date,
                                      values.rotation_dates[i]
                                        .rotation_speciality_id,
                                      initialValues.rotation_dates[i]
                                        .start_date,
                                      initialValues.rotation_dates[i]
                                        .finish_date,
                                      false,
                                      i != 0 &&
                                        values.rotation_dates[0].start_date !=
                                          null
                                        ? values.rotation_dates[0].start_date
                                        : null,
                                      i != 0 &&
                                        values.rotation_dates[i - 1]
                                          .finish_date != null
                                        ? values.rotation_dates[i - 1]
                                            .finish_date
                                        : null
                                    )
                                  }
                                  minDate={moment(dataRotation.start_date).add(
                                    1,
                                    "day"
                                  )}
                                  maxDate={moment(dataRotation.finish_date).add(
                                    1,
                                    "day"
                                  )}
                                  label={t("rotations.finishDate")}
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      id: `rotation_dates.${i}.finish_date`,
                                      name: `rotation_dates.${i}.finish_date`,
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          );
                        }
                      )
                    }
                  </FieldArray>
                  <Grid container>
                    <Grid
                      item
                      lg={12}
                      xs={12}
                      sx={{
                        direction: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        display: "flex",
                        marginTop: "10px",
                        marginRight: "20px",
                      }}
                    >
                      <CancelButton onClick={toggleDrawer} />
                      <EditButton />
                    </Grid>
                  </Grid>
                </Form>
              </Box>
            )}
          </Formik>
        )}
    </>
  );
}
