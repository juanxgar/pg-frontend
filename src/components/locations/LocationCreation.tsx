import {
  AddButton,
  CancelButton,
  CreateButton,
  InputComponent,
  LocationListComponent,
} from "@/components";
import { useLocation, useSpeciality } from "@/hooks";
import { LocationCreationSchema } from "@/schemas";
import {
  LocationCreationBody,
  SpecialityItem,
  SpecialityLocationItem,
} from "@/types";
import { AlertColor, Box, Grid, MenuItem, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";

interface Props {
  toggleDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (openSnackbar: boolean) => void;
  refetch: () => void;
  checked: Array<boolean>;
  setChecked: (cheked: Array<boolean>) => void;
}

export function LocationCreation(props: Props): ReactElement {
  const {
    toggleDrawer,
    refetch,
    setLoading,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    checked,
    setChecked,
  } = props;

  const { useCreateLocation } = useLocation();

  const { useAllSpecialities, errorStatus } = useSpeciality();

  const t = useTranslations();

  const [specialityId, setSpecialityId] = useState<number>(0);
  const [touchedSpecialityId, setTouchedSpecialityId] =
    useState<boolean>(false);
  const [specialityDescription, setSpecialityDescription] =
    useState<string>("");
  const [limitCapacity, setLimitCapacity] = useState<number>(0);
  const [touchedLimitCapacity, setTouchedLimitCapacity] =
    useState<boolean>(false);

  const [specialitiesList, setSpecialitiesList] = useState<
    Array<SpecialityLocationItem>
  >([]);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      name: "",
      adress: "",
      city: "",
      complexity: "",
      total_capacity: 0,
      specialities: [],
    },
    validationSchema: LocationCreationSchema(t),
    onSubmit: (values) => {
      createLocation(values);
    },
  });

  const createLocation = (values: LocationCreationBody) => {
    mutate(values);
    refetch();
  };

  const {
    data: dataSpecialities,
    isLoading: isLoadingSpecialities,
  }: {
    data: Array<SpecialityItem> | undefined;
    isLoading: boolean;
  } = useAllSpecialities({
    state: true,
  });

  const {
    mutate,
    isSuccess,
    data: dataCreation,
    isLoading: isLoadingCreation,
    isError,
    error,
  } = useCreateLocation();

  const addSpecialityToList = () => {
    const speciality: SpecialityLocationItem = {
      speciality_id: specialityId,
      speciality_description: specialityDescription,
      limit_capacity: limitCapacity,
    };

    if (specialityId != 0 && limitCapacity != 0) {
      if (
        !specialitiesList.some(
          (e) => e.speciality_id === speciality.speciality_id
        )
      ) {
        setSpecialitiesList((old) => [...old, speciality]);
        const specialitiesListAux = specialitiesList.map(
          (speciality: SpecialityLocationItem) => {
            return {
              speciality_id: speciality.speciality_id,
              limit_capacity: speciality.limit_capacity,
            };
          }
        );
        specialitiesListAux.push({
          speciality_id: specialityId,
          limit_capacity: limitCapacity,
        });
        formik.setFieldValue("specialities", specialitiesListAux);

        setSpecialityId(0);
        setSpecialityDescription("");
        setLimitCapacity(0);
      } else {
        setMessageSnackbar(t("locations.specialityAddedToList"));
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
    if (specialityId === 0) {
      setTouchedSpecialityId(true);
    }
    if (limitCapacity === 0) {
      setTouchedLimitCapacity(true);
    }
  };

  const deleteSpecialityFromList = (speciality_id: number) => {
    const specialitiesListAux = specialitiesList.filter(
      (speciality: SpecialityLocationItem) =>
        speciality.speciality_id != speciality_id
    );
    formik.setFieldValue("specialities", specialitiesListAux);
    setSpecialitiesList((old) =>
      old.filter((e) => e.speciality_id != speciality_id)
    );
  };

  const handleChangeSpecialities = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ) => {
    if (type === "speciality_id") {
      setSpecialityId(+event.target.value);
    }
    if (type === "limit_capacity") {
      setLimitCapacity(+event.target.value);
    }
  };

  useEffect(() => {
    if (!isLoadingSpecialities) {
      setLoading(false);
    }
  }, [isLoadingSpecialities]);

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataCreation.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
      checked.push(false);
      setChecked(checked);
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

  useEffect(() => {
    if (limitCapacity != 0) {
      setTouchedLimitCapacity(false);
    }
    if (specialityId != 0) {
      setTouchedSpecialityId(false);
    }
  }, [limitCapacity, specialityId]);

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
              id="adress"
              name="adress"
              label={t("locations.adress")}
              value={formik.values.adress || ""}
              onChange={formik.handleChange}
              error={formik.touched.adress && Boolean(formik.errors.adress)}
              helperText={formik.touched.adress && formik.errors.adress}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="city"
              name="city"
              label={t("locations.city")}
              value={formik.values.city || ""}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              select
              id="complexity"
              name="complexity"
              label={t("locations.complexity")}
              value={formik.values.complexity || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.complexity && Boolean(formik.errors.complexity)
              }
              helperText={formik.touched.complexity && formik.errors.complexity}
              inputProps={{ maxLength: 20 }}
            >
              <MenuItem value={t("locations.level1")}>
                {t("locations.level1")}
              </MenuItem>
              <MenuItem value={t("locations.level2")}>
                {t("locations.level2")}
              </MenuItem>
              <MenuItem value={t("locations.level3")}>
                {t("locations.level3")}
              </MenuItem>
              <MenuItem value={t("locations.level4")}>
                {t("locations.level4")}
              </MenuItem>
            </InputComponent>
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="number"
              id="total_capacity"
              name="total_capacity"
              label={t("locations.totalCapacity")}
              value={formik.values.total_capacity}
              onChange={formik.handleChange}
              error={
                formik.touched.total_capacity &&
                Boolean(formik.errors.total_capacity)
              }
              helperText={
                formik.touched.total_capacity && formik.errors.total_capacity
              }
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
            />
          </Grid>
          <Grid item lg={12} xs={12}>
            <Typography
              sx={{
                textAlign: "left",
                fontSize: "20px",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              {t("locations.addSpecialities")}
            </Typography>
          </Grid>
          <Grid item lg={5} xs={12}>
            <InputComponent
              type="text"
              select
              id="speciality_id"
              name="speciality_id"
              label={t("specialities.speciality")}
              value={specialityId}
              onChange={(e) => handleChangeSpecialities(e, "speciality_id")}
              error={touchedSpecialityId}
              helperText={
                touchedSpecialityId && t("commons.validations.requiredField")
              }
            >
              <MenuItem value={0}>{t("commons.select")}</MenuItem>
              {dataSpecialities ? (
                dataSpecialities?.map((speciality: SpecialityItem) => (
                  <MenuItem
                    key={speciality.speciality_id}
                    value={speciality.speciality_id}
                    onClick={() =>
                      setSpecialityDescription(speciality.description)
                    }
                  >
                    {speciality.description}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={5} xs={12}>
            <InputComponent
              type="number"
              id="limit_capacity"
              name="limit_capacity"
              label={t("locations.limitCapacity")}
              value={limitCapacity}
              onChange={(e) => handleChangeSpecialities(e, "limit_capacity")}
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              error={touchedLimitCapacity}
              helperText={
                touchedLimitCapacity && t("commons.validations.requiredField")
              }
            />
          </Grid>
          <Grid item lg={2} xs={12}>
            <AddButton
              sx={{ marginRight: "10px" }}
              onClick={addSpecialityToList}
            />
          </Grid>
          <Grid item lg={12} xs={12}>
            {specialitiesList.length > 0 && (
              <LocationListComponent
                specialities={specialitiesList}
                deleteSpecialityFromList={deleteSpecialityFromList}
              />
            )}
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
            <CreateButton type="submit" />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
