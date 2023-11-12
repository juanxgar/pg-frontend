"use client";

import { SnackbarComponent } from "@/components";
import { useAuth } from "@/hooks";
import { NewPasswordSchema } from "@/schemas/recoverPassword.schemas";
import { FormikNewPasswordRequest, Locale, NewPasswordRequest } from "@/types";
import { Images } from "@/utils";
import {
  AlertColor,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  Link as LinkMaterial,
  Button,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

type Props = {
  params: Locale;
};

export default function Page(props: Props): ReactElement {
  const { params } = props;
  const t = useTranslations();

  const { useNewPassword } = useAuth();

  const router: AppRouterInstance = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const {
    mutate,
    isSuccess,
    isError,
    error,
    data: dataRecover,
    isLoading: isLoadingRecover,
  } = useNewPassword();

  const newPassword = (credentials: FormikNewPasswordRequest) => {
    if (credentials.password != credentials.password2) {
      handleOpenSnackbar("warning", t("user.samePasswords"));
    } else {
      const body: NewPasswordRequest = {
        resetPasswordToken: credentials.resetPasswordToken,
        password: credentials.password,
      };
      mutate(body);
    }
  };

  const handleOpenSnackbar = (severity: AlertColor, message: string) => {
    setMessageSnackbar(message);
    setSeveritySnackbar(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (isLoadingRecover) {
      setIsLoading(true);
    }

    if (isSuccess) {
      setIsLoading(false);
      handleOpenSnackbar("success", dataRecover.message);
      setTimeout(() => {
        router.push(`/${params.locale}`);
      }, 2000);
    }

    if (isError) {
      setIsLoading(false);
      handleOpenSnackbar("warning", error.message);
    }
  }, [isLoadingRecover, isSuccess]);

  return (
    <Grid
      container
      sx={{
        maxHeight: { lg: "98vh", xs: "100%" },
      }}
    >
      <SnackbarComponent
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
      />
      <Grid item lg={6} xs={12}>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            minHeight: { xs: "100%", lg: "95vh" },
            marginY: { xs: "20px", lg: "0px" },
          }}
        >
          <Image
            style={{
              maxWidth: "100%",
              height: "auto",
              padding: 0,
              margin: 0,
            }}
            src={Images.logo}
            alt="Logo UCEVA"
            priority={true}
          />
        </Box>
      </Grid>
      <Grid item lg={6} xs={12}>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            minHeight: { lg: "95vh", xs: "100%" },
            marginTop: { lg: "0px", xs: "20px" },
            marginBottom: { lg: "0px", xs: "80px" },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              width: { lg: "60%", xs: "80%" },
              height: "100%",
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: { lg: "0px", xs: "20px" },
                  }}
                >
                  <Typography component="h1" variant="h5">
                    {t("recoverPassword.recoverPassword")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} marginTop="25px">
                <Typography component="sub" variant="body1">
                  {t("recoverPassword.newPasswordMessage")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Formik
                  initialValues={{
                    resetPasswordToken: "",
                    password: "",
                    password2: "",
                  }}
                  validationSchema={NewPasswordSchema(t)}
                  onSubmit={(values) => {
                    newPassword(values);
                  }}
                >
                  {(formik) => (
                    <Form
                      method="post"
                      onSubmit={(e) => {
                        formik.handleSubmit(e);
                      }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          id="resetPasswordToken"
                          name="resetPasswordToken"
                          label={t("recoverPassword.recoverToken")}
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          autoFocus
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.resetPasswordToken &&
                            Boolean(formik.errors.resetPasswordToken)
                          }
                          helperText={
                            formik.touched.resetPasswordToken &&
                            formik.errors.resetPasswordToken
                          }
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <TextField
                          id="password"
                          name="password"
                          label={t("user.password")}
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          type="password"
                          autoFocus
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                          }
                          helperText={
                            formik.touched.password && formik.errors.password
                          }
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <TextField
                          id="password2"
                          name="password2"
                          label={t("user.password2")}
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          type="password"
                          autoFocus
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.password2 &&
                            Boolean(formik.errors.password2)
                          }
                          helperText={
                            formik.touched.password2 && formik.errors.password2
                          }
                        />
                      </FormControl>
                      <Grid container marginTop="30px">
                        <Grid item xs={6} marginTop="10px">
                          <LinkMaterial
                            style={{ cursor: "pointer" }}
                            variant="body2"
                            href={`/${params.locale}`}
                          >
                            {t("commons.back")}
                          </LinkMaterial>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="success"
                            disabled={isLoading}
                            sx={{
                              marginLeft: "15px",
                            }}
                          >
                            {isLoading && (
                              <>
                                <CircularProgress
                                  style={{ width: "20px", height: "25px" }}
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </>
                            )}

                            {t("recoverPassword.send")}
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
