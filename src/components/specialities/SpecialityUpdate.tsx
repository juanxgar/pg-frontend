import { CancelButton, EditButton, InputComponent } from "@/components";
import { useSpeciality } from "@/hooks";
import { SpecialityCreationSchema } from "@/schemas";
import { SpecialityItem, UpdateSpecialityRequest } from "@/types";
import { AlertColor, Box, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect } from "react";

interface Props {
  toggleDrawer: () => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (openSnackbar: boolean) => void;
  refetch: () => void;
  dataSpeciality: SpecialityItem;
  updateChecked: () => void;
}

export function SpecialityUpdate(props: Props): ReactElement {
  const {
    toggleDrawer,
    refetch,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    dataSpeciality,
    updateChecked,
  } = props;

  const { useUpdateSpeciality, errorStatus } = useSpeciality();

  const t = useTranslations();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      speciality_id: `${dataSpeciality.speciality_id}`,
      description: dataSpeciality.description,
    },
    validationSchema: SpecialityCreationSchema(t),
    onSubmit: (values) => {
      const { speciality_id, ...body } = values;
      const updateSpecialityRequest: UpdateSpecialityRequest = {
        speciality_id,
        body,
      };
      updateSpeciality(updateSpecialityRequest);
    },
  });

  const updateSpeciality = (values: UpdateSpecialityRequest) => {
    mutate(values);
  };

  const {
    mutate,
    isSuccess,
    data: dataUpdate,
    isLoading: isLoadingUpdate,
    isError,
    error,
  } = useUpdateSpeciality();

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataUpdate.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
      updateChecked();
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
          <Grid item lg={12} xs={12}>
            <InputComponent
              type="text"
              id="description"
              name="description"
              label={t("specialities.description")}
              value={formik.values.description || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              inputProps={{ maxLength: 50 }}
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
  );
}
