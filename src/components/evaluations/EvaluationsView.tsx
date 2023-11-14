import {
  Breadcrumb,
  PageTitle,
  InputComponent,
  CleanSearchButton,
  SnackbarComponent,
  SearchButton,
  EvaluationForm,
} from "@/components";
import { EvaluationSearchSchema } from "@/schemas";
import {
  FormikEvaluationSearch,
  GroupDetailInRotation,
  GroupInRotation,
  Navigator,
  RotationInRotation,
  RotationSpecialityInRotation,
  UserItem,
} from "@/types";
import {
  AlertColor,
  Box,
  Checkbox,
  Grid,
  MenuItem,
  Theme,
  Typography,
  checkboxClasses,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import React, { ReactElement, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useEvaluation, useGroup, useUser } from "@/hooks";
import moment from "moment";

interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
  isStudent?: boolean;
  isProfessor?: boolean;
}

export function EvaluationsView(props: Props): ReactElement {
  const { locale, setLoading, isStudent } = props;
  const t = useTranslations();
  const { useGroupsInRotation } = useGroup();
  const { useLoggedUser } = useUser();

  const { useSpecificEvaluationBySpecialityAndStudent } = useEvaluation();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const [isCurrently, setCurrently] = useState<boolean>(true);

  const [areFieldsDisabled, setFieldsDisabled] = useState<boolean>(true);
  const [isSpecialityDisabled, setSpecialityDisabled] = useState<boolean>(true);
  const [positionGroup, setPositionGroup] = useState<number>(0);
  const [positionRotation, setPositionRotation] = useState<number>(0);
  const [positionGroupDetail, setPositionGroupDetail] = useState<number>(0);
  const [positionSpeciality, setPositionSpeciality] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [professor_user_id, setProfessor_user_id] = useState<string>("");
  const [student_user_id, setStudent_user_id] = useState<string>("");
  const [rotation_speciality_id, setRotation_speciality_id] =
    useState<string>("");

  const [initialValues, setInitialValues] = useState<FormikEvaluationSearch>({
    group_id: "",
    student_user_id: "",
    date: "",
    rotation_speciality_id: "",
  });

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/evaluation`, name: t("commons.evaluations") },
  ];

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: initialValues,
    validationSchema: EvaluationSearchSchema(t),
    onSubmit: (values) => {
      search(values);
    },
  });

  const search = (values: FormikEvaluationSearch) => {
    if (values.rotation_speciality_id === "") {
      setMessageSnackbar("Debe seleccionar todos los campos");
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
    if (!isStudent) {
      setStudent_user_id(values.student_user_id);
    }
    setRotation_speciality_id(values.rotation_speciality_id);
  };

  const {
    data: dataUser,
    isLoading: isLoadingUser,
  }: {
    data: UserItem | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useLoggedUser();

  useEffect(() => {
    if (!isLoadingUser && dataUser) {
      if (dataUser.role === "Estudiante") {
        setStudent_user_id(dataUser.user_id as unknown as string);
        setInitialValues({
          group_id: "",
          student_user_id: dataUser.user_id as unknown as string,
          date: "",
          rotation_speciality_id: "",
        });
      }

      if (dataUser.role === "Profesor") {
        setProfessor_user_id(dataUser.user_id as unknown as string);
      }
    }
  }, [isLoadingUser]);

  const {
    data: dataGroups,
    isLoading: isLoadingGroups,
  }: {
    data: Array<GroupInRotation> | undefined;
    isLoading: boolean;
  } = useGroupsInRotation({ isCurrently, student_user_id: professor_user_id });

  const {
    data: dataEvaluation,
    isLoading: isLoadingEvaluation,
    isSuccess: isSucessEvaluation,
    isError: isErrorEvaluation,
    error: errorEvaluation,
    refetch: refetchEvaluation,
  } = useSpecificEvaluationBySpecialityAndStudent({
    rotation_speciality_id,
    student_user_id,
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const cleanForm = () => {
    formik.resetForm();
    setFieldsDisabled(true);
    setSpecialityDisabled(true);
    setShowForm(false);
  };

  const disableButtons = (value: string, field: string) => {
    if (field === "group_id" && value != "") {
      setFieldsDisabled(false);
    }
    if (field === "date" && value != "") {
      setSpecialityDisabled(false);
    }
  };

  const handleIsCurrently = () => {
    setCurrently(!isCurrently);
  };

  useEffect(() => {
    if (!isLoadingGroups) {
      setLoading(false);
    }
  }, [isLoadingGroups]);

  useEffect(() => {
    if (student_user_id != "" && rotation_speciality_id != "") {
      setShowForm(true);
      refetchEvaluation();
    }
  }, [student_user_id, rotation_speciality_id]);

  useEffect(() => {
    if (!isLoadingEvaluation) {
      if (isErrorEvaluation) {
        setMessageSnackbar(errorEvaluation.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
  }, [isLoadingEvaluation, isSucessEvaluation, isErrorEvaluation]);

  return (
    <>
      <SnackbarComponent
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
      />
      <Grid container>
        <Grid item lg={6} xs={12}>
          <Breadcrumb navigator={navigator} />
        </Grid>
        <Grid item lg={6} xs={12}>
          <Box
            sx={{
              float: { lg: "right", xs: "left" },
              marginTop: { lg: "0px", xs: "10px" },
            }}
          >
            <PageTitle>{t("commons.evaluations")}</PageTitle>
          </Box>
        </Grid>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            direction: "column",
            alignItems: { lg: "left", xs: "center" },
            justifyContent: { lg: "left", xs: "center" },
            display: { lg: "flex-start", xs: "flex" },
            marginTop: "20px",
          }}
        >
          <CleanSearchButton clearFunction={cleanForm} />
          <Box marginLeft="10px">
            <SearchButton />
          </Box>
        </Box>
        <Grid container marginTop="20px">
          <Grid item lg={2} xs={6}>
            <Grid container marginTop="5px">
              <Grid item lg={3} xs={3}>
                <Checkbox
                  sx={{
                    marginTop: "5px",
                    [`&.${checkboxClasses.checked}`]: {
                      color: "green",
                    },
                  }}
                  value={isCurrently}
                  onChange={(e) => handleIsCurrently()}
                  checked={isCurrently}
                />
              </Grid>
              <Grid item lg={3} xs={3}>
                <Typography variant="body1">
                  {t("evaluations.currentRotations")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="text"
              id="group_id"
              name="group_id"
              label={t("groups.groupCapitalLetter")}
              value={formik.values.group_id}
              onChange={(e) => {
                formik.handleChange(e);
                disableButtons(e.target.value, "group_id");
              }}
              error={formik.touched.group_id && Boolean(formik.errors.group_id)}
              helperText={formik.touched.group_id && formik.errors.group_id}
              select
            >
              {dataGroups ? (
                dataGroups?.map((group: GroupInRotation, i: number) => (
                  <MenuItem
                    key={group.group_id}
                    value={group.group_id}
                    onClick={() => setPositionGroup(i)}
                  >
                    {group.name}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          {!isStudent && (
            <Grid item lg={2} xs={6}>
              <InputComponent
                type="text"
                id="student_user_id"
                name="student_user_id"
                select
                disabled={areFieldsDisabled}
                label={t("commons.student")}
                value={formik.values.student_user_id}
                onChange={formik.handleChange}
                error={
                  formik.touched.student_user_id &&
                  Boolean(formik.errors.student_user_id)
                }
                helperText={
                  formik.touched.student_user_id &&
                  formik.errors.student_user_id
                }
              >
                {dataGroups &&
                dataGroups[positionGroup] &&
                dataGroups[positionGroup].group_detail ? (
                  dataGroups[positionGroup].group_detail?.map(
                    (student: GroupDetailInRotation, i: number) => (
                      <MenuItem
                        onClick={() => setPositionGroupDetail(i)}
                        key={student.user.user_id}
                        value={student.user.user_id}
                      >
                        {student.user.name} {student.user.lastname}
                      </MenuItem>
                    )
                  )
                ) : (
                  <div></div>
                )}
              </InputComponent>
            </Grid>
          )}

          <Grid item lg={2} xs={6}>
            <InputComponent
              type="text"
              id="date"
              name="date"
              select
              disabled={areFieldsDisabled}
              label={t("rotations.dates")}
              value={formik.values.date}
              onChange={(e) => {
                formik.handleChange(e);
                disableButtons(e.target.value, "date");
              }}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
            >
              {dataGroups &&
              dataGroups[positionGroup] &&
              dataGroups[positionGroup].rotation ? (
                dataGroups[positionGroup].rotation?.map(
                  (rotation: RotationInRotation, i: number) => (
                    <MenuItem
                      key={rotation.rotation_id}
                      value={rotation.rotation_id}
                      onClick={() => setPositionRotation(i)}
                    >
                      {moment(rotation.start_date)
                        .add(1, "days")
                        .format("DD-MM-YYYY")}{" "}
                      {" - "}
                      {moment(rotation.finish_date)
                        .add(1, "days")
                        .format("DD-MM-YYYY")}
                    </MenuItem>
                  )
                )
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="text"
              id="rotation_speciality_id"
              name="rotation_speciality_id"
              select
              disabled={isSpecialityDisabled}
              label={t("specialities.speciality")}
              value={formik.values.rotation_speciality_id}
              onChange={formik.handleChange}
              error={
                formik.touched.rotation_speciality_id &&
                Boolean(formik.errors.rotation_speciality_id)
              }
              helperText={
                formik.touched.rotation_speciality_id &&
                formik.errors.rotation_speciality_id
              }
            >
              {dataGroups &&
              dataGroups[positionGroup] &&
              dataGroups[positionGroup].rotation ? (
                dataGroups[positionGroup].rotation[
                  positionRotation
                ]?.rotation_speciality?.map(
                  (speciality: RotationSpecialityInRotation, i: number) => (
                    <MenuItem
                      onClick={() => setPositionSpeciality(i)}
                      key={speciality.rotation_speciality_id}
                      value={speciality.rotation_speciality_id}
                    >
                      {speciality.speciality.description}
                    </MenuItem>
                  )
                )
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
        </Grid>
      </form>
      {showForm && (
        <EvaluationForm
          locale={locale}
          groupInRotation={dataGroups && dataGroups[positionGroup]}
          positionGroupDetail={positionGroupDetail}
          positionRotation={positionRotation}
          positionSpeciality={positionSpeciality}
          dataEvaluation={dataEvaluation}
          isLoadingEvaluation={isLoadingEvaluation}
          isErrorEvaluation={isErrorEvaluation}
          setMessageSnackbar={setMessageSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          setSeveritySnackbar={setSeveritySnackbar}
          refetchEvaluation={refetchEvaluation}
          isStudent={isStudent}
        />
      )}
    </>
  );
}
