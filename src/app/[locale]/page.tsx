"use client";

import {
  Footer,
  LogoSkeleton,
  FormSkeleton,
  SnackbarComponent,
} from "@/components";
import { Images } from "@/utils";
import {
  Box,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  Link as LinkMaterial,
  Button,
  useMediaQuery,
  AlertColor,
  CircularProgress,
  Theme,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Form, Formik } from "formik";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { LoginSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { SignInRequest } from "@/types/request.type";
import { ReactElement, useEffect, useState } from "react";
import { Locale } from "@/types";

type Props = {
  params: Locale;
};

export default function Page(props: Props): ReactElement {
  const { params }: { params: Locale } = props;
  const { status, update }: { status: string; update: () => void } =
    useSession<boolean>();
  const t = useTranslations();

  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));
  const xs: boolean = useMediaQuery(theme.breakpoints.up("xs"));

  useEffect(() => {
    if (lg || xs) {
      setShow(true);
    }
  }, [lg, xs]);

  const handleOpenSnackbar = (severity: AlertColor, message: string) => {
    setMessageSnackbar(message);
    setSeveritySnackbar(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const login = async (values: SignInRequest) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.url != null) {
        update();
        handleOpenSnackbar("success", t("login.correctLogin"));
        setTimeout(() => {
          window.location.href = `/${params.locale}/home`;
        }, 2000);
      } else {
        handleOpenSnackbar("error", t("login.incorrectLogin"));
      }
    } catch (e) {
      handleOpenSnackbar("error", t("commons.apiError"));
    }
  };

  return (
    <>
      {show && (
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
                minHeight: lg ? "95vh" : "100%",
                marginY: lg ? "0px" : "20px",
              }}
            >
              {status === "loading" ? (
                <LogoSkeleton lg={lg} />
              ) : (
                <Image
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    padding: 0,
                    margin: 0,
                  }}
                  src={Images.logo}
                  alt="Logo UCEVA"
                />
              )}
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
                {status === "loading" ? (
                  <FormSkeleton />
                ) : (
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
                          {t("login.description")}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Formik
                        initialValues={{
                          email: "",
                          password: "",
                        }}
                        validationSchema={LoginSchema(t)}
                        onSubmit={(values) => {
                          login(values);
                        }}
                      >
                        {(formik) => (
                          <Form
                            method="post"
                            action="api/auth/callback/credentials"
                            onSubmit={(e) => {
                              formik.handleSubmit(e);
                            }}
                          >
                            <FormControl fullWidth>
                              <TextField
                                id="email"
                                name="email"
                                label={t("user.email")}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                autoComplete="email"
                                autoFocus
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.email &&
                                  Boolean(formik.errors.email)
                                }
                                helperText={
                                  formik.touched.email && formik.errors.email
                                }
                              />
                            </FormControl>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label={t("user.password")}
                              type="password"
                              id="password"
                              autoComplete="current-password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.password &&
                                Boolean(formik.errors.password)
                              }
                              helperText={
                                formik.touched.password &&
                                formik.errors.password
                              }
                            />
                            <LinkMaterial
                              style={{ cursor: "pointer" }}
                              variant="body2"
                              href="/auth/recover"
                            >
                              {t("login.forgotPassword")}
                            </LinkMaterial>
                            <Box
                              sx={{
                                width: { lg: "50%", xs: "80%" },
                                marginTop: "30px",
                                float: "right",
                              }}
                            >
                              <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="success"
                                disabled={isLoading}
                              >
                                {isLoading && (
                                  <>
                                    <CircularProgress
                                      style={{ width: "20px", height: "25px" }}
                                    />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  </>
                                )}

                                {t("login.logIn")}
                              </Button>
                            </Box>
                          </Form>
                        )}
                      </Formik>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: { lg: "0px", xs: "50px" } }}>
            <Footer />
          </Grid>
        </Grid>
      )}
    </>
  );
}
