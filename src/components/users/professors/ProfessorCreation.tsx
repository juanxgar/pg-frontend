import { CancelButton, CreateButton, InputComponent } from "@/components";
import { useSpeciality, useUser } from "@/hooks";
import { ProfessorCreationSchema } from "@/schemas";
import { UserCreationBody } from "@/types";
import { AlertColor, Box, Grid, MenuItem, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ChangeEvent, ReactElement, useEffect } from "react";

interface Props {
  toggleDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (openSnackbar: boolean) => void;
  refetch: () => void;
  checked: Array<boolean>;
  setChecked: (cheked: Array<boolean>) => void;
  updateChecked: () => void;
}

export function ProfessorCreation(props: Props): ReactElement {
  const {
    toggleDrawer,
    refetch,
    setLoading,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    checked,
    setChecked,
    updateChecked
  } = props;

  const { useCreateUser } = useUser();

  const { useAllSpecialities, errorStatus } = useSpeciality();

  const t = useTranslations();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      name: "",
      lastname: "",
      identification: 0,
      role: "Profesor",
      code: "",
      email: "",
      password: "",
      speciality_id: undefined,
    },
    validationSchema: ProfessorCreationSchema(t),
    onSubmit: (values) => {
      createUser(values);
    },
  });

  const createUser = (values: UserCreationBody) => {
    mutate(values);
    refetch();
  };

  const { data, isLoading } = useAllSpecialities({
    state: true,
  });

  const {
    mutate,
    isSuccess,
    data: dataCreation,
    isLoading: isLoadingCreation,
    isError,
    error,
  } = useCreateUser();

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataCreation.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
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
    <Box sx={{ width: { xs: "325px", lg: "600px" } }}>
      <Typography
        sx={{
          textAlign: "left",
          fontSize: "20px",
          marginLeft: "20px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        {t("commons.creationForm")}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="name"
              name="name"
              label={t("user.name")}
              value={formik.values.name || ""}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="lastname"
              name="lastname"
              label={t("user.lastname")}
              value={formik.values.lastname || ""}
              onChange={formik.handleChange}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
              helperText={formik.touched.lastname && formik.errors.lastname}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="number"
              id="identification"
              name="identification"
              label={t("user.identification")}
              value={formik.values.identification || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.identification &&
                Boolean(formik.errors.identification)
              }
              helperText={
                formik.touched.identification && formik.errors.identification
              }
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 10);
              }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="code"
              name="code"
              label={t("user.code")}
              value={formik.values.code || ""}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="email"
              id="email"
              name="email"
              label={t("user.email")}
              value={formik.values.email || ""}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="password"
              id="password"
              name="password"
              label={t("user.password")}
              value={formik.values.password || ""}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="number"
              select
              id="speciality_id"
              name="speciality_id"
              label={t("specialities.speciality")}
              value={formik.values.speciality_id ?? ""}
              onChange={formik.handleChange}
              error={
                formik.touched.speciality_id &&
                Boolean(formik.errors.speciality_id)
              }
              helperText={
                formik.touched.speciality_id && formik.errors.speciality_id
              }
            >
              {data ? (
                data?.map((speciality) => (
                  <MenuItem
                    key={speciality.speciality_id}
                    value={speciality.speciality_id}
                  >
                    {speciality.description}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
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
            <CreateButton />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
