import { CancelButton, EditButton, InputComponent } from "@/components";
import { useUser } from "@/hooks";
import { StudentCreationSchema } from "@/schemas";
import { StudentItem, UpdateUserRequest } from "@/types";
import { AlertColor, Box, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect } from "react";

interface Props {
  toggleDrawer: () => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (open: boolean) => void;
  refetch: () => void;
  dataStudent: StudentItem;
}

export function StudentUpdate(props: Props) {
  const {
    toggleDrawer,
    refetch,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    dataStudent,
  } = props;

  const { useUpdateUser, errorStatus } = useUser();

  const t = useTranslations();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      user_id: `${dataStudent.user_id}`,
      name: dataStudent.name,
      lastname: dataStudent.lastname,
      identification: dataStudent.identification,
      role: "Estudiante",
      code: dataStudent.code,
      email: dataStudent.email,
      password: "",
    },
    validationSchema: StudentCreationSchema(t),
    onSubmit: (values) => {
      const { user_id, ...body } = values;
      const updateUser: UpdateUserRequest = {
        user_id,
        body,
      };
      createUser(updateUser);
    },
  });

  const createUser = (values: UpdateUserRequest) => {
    mutate(values);
    refetch();
  };

  const {
    mutate,
    isSuccess,
    data: dataUpdate,
    isLoading: isLoadingUpdate,
    isError,
    error,
  } = useUpdateUser();

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataUpdate.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
    }
  }, [isLoadingUpdate]);

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
          {t("commons.updateForm")}
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
                error={
                  formik.touched.lastname && Boolean(formik.errors.lastname)
                }
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
                    .slice(0, 12);
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                inputProps={{ maxLength: 20 }}
              />
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
              <EditButton />
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}
