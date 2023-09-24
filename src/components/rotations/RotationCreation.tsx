import {
  AddButton,
  CancelButton,
  CreateButton,
  InputComponent,
  RotationListComponent,
} from "@/components";
import { useGroup, useLocation, useRotation, useUser } from "@/hooks";
import { RotationCreationSchema } from "@/schemas";
import {
  GroupItem,
  LocationDetailItem,
  LocationItem,
  ProfessorItem,
  RotationCreationBody,
  RotationSpecialityCreationBody,
  SpecialityRotationItem,
} from "@/types";
import {
  AlertColor,
  Box,
  Divider,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import moment from "moment";

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

export function RotationCreation(props: Props): ReactElement {
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

  const { useCreateRotation } = useRotation();
  const { useAllGroups } = useGroup();
  const { useLocationDetail, useAllLocations } = useLocation();
  const { useAllProfessors, errorStatus } = useUser();

  const t = useTranslations();

  const [locationId, setLocationId] = useState<number>(0);
  const [specialityId, setSpecialityId] = useState<number>(0);
  const [touchedSpecialityId, setTouchedSpecialityId] =
    useState<boolean>(false);
  const [specialityDescription, setSpecialityDescription] =
    useState<string>("");
  const [professorId, setProfessorId] = useState<number>(0);
  const [touchedProfessorId, setTouchedProfessorId] = useState<boolean>(false);
  const [professorName, setProfessorName] = useState<string>("");
  const [groupProfessorName, setGroupProfessorName] = useState<string>("");
  const [numberWeeks, setNumberWeeks] = useState<number>(0);
  const [touchedNumberWeeks, setTouchedNumberWeeks] = useState<boolean>(false);

  const [rotationsSpecialitiesList, setRotationsSpecialitiesList] = useState<
    Array<SpecialityRotationItem>
  >([]);
  const initialValues: RotationCreationBody = {
    finish_date: "",
    group_id: 0,
    location_id: 0,
    semester: 0,
    specialities: [],
    start_date: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: initialValues,
    validationSchema: RotationCreationSchema(t),
    onSubmit: (values) => {
      createRotation(values);
    },
  });

  const createRotation = (values: RotationCreationBody) => {
    mutate(values);
    refetch();
  };

  const {
    data: dataGroups,
    isLoading: isLoadingGroups,
  }: {
    data: Array<GroupItem> | undefined;
    isLoading: boolean;
  } = useAllGroups({
    state: true,
  });

  const {
    data: dataLocations,
    isLoading: isLoadingLocations,
  }: {
    data: Array<LocationItem> | undefined;
    isLoading: boolean;
  } = useAllLocations({
    state: true,
  });

  const {
    data: dataSpecialities,
    isLoading: isLoadingSpecialities,
  }: {
    data: Array<LocationDetailItem> | undefined;
    isLoading: boolean;
  } = useLocationDetail({
    location_id: locationId,
  });

  const {
    data: dataProfessors,
    isLoading: isLoadingProfessors,
  }: {
    data: Array<ProfessorItem> | undefined;
    isLoading: boolean;
  } = useAllProfessors({
    state: true,
    speciality_id: specialityId,
  });

  const {
    mutate,
    isSuccess,
    data: dataCreation,
    isLoading: isLoadingCreation,
    isError,
    error,
  } = useCreateRotation();

  const addRotationsSpecialitiesToList = () => {
    const rotationSpeciality: SpecialityRotationItem = {
      professor_user_id: professorId,
      speciality_id: specialityId,
      professor_name: professorName,
      speciality_description: specialityDescription,
      number_weeks: numberWeeks,
    };

    if (specialityId != 0 && professorId != 0) {
      if (
        !rotationsSpecialitiesList.some(
          (e) => e.speciality_id === rotationSpeciality.speciality_id
        )
      ) {
        setRotationsSpecialitiesList((old) => [...old, rotationSpeciality]);
        const specialitiesListAux = rotationsSpecialitiesList.map(
          (speciality: RotationSpecialityCreationBody) => {
            return {
              speciality_id: speciality.speciality_id,
              professor_user_id: speciality.professor_user_id,
              number_weeks: speciality.number_weeks,
            };
          }
        );
        specialitiesListAux.push({
          speciality_id: specialityId,
          professor_user_id: professorId,
          number_weeks: numberWeeks,
        });
        formik.setFieldValue("specialities", specialitiesListAux);

        setSpecialityId(0);
        setSpecialityDescription("");
        setProfessorId(0);
        setProfessorName("");
        setNumberWeeks(0);
      } else {
        setMessageSnackbar(t("locations.specialityAddedToList"));
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
    if (specialityId === 0) {
      setTouchedSpecialityId(true);
    }
    if (professorId === 0) {
      setTouchedProfessorId(true);
    }
    if (numberWeeks === 0) {
      setTouchedNumberWeeks(true);
    }
  };

  const deleteRotationSpecialityFromList = (speciality_id: number) => {
    const specialitiesListAux = rotationsSpecialitiesList.filter(
      (speciality: RotationSpecialityCreationBody) =>
        speciality.speciality_id != speciality_id
    );
    formik.setFieldValue("specialities", specialitiesListAux);
    setRotationsSpecialitiesList((old) =>
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
    if (type === "professor_id") {
      setProfessorId(+event.target.value);
    }
    if (type === "number_weeks") {
      setNumberWeeks(+event.target.value);
    }
  };

  useEffect(() => {
    if (
      !isLoadingProfessors &&
      !isLoadingSpecialities &&
      !isLoadingGroups &&
      !isLoadingLocations
    ) {
      setLoading(false);
    }
  }, [
    isLoadingProfessors,
    isLoadingSpecialities,
    isLoadingGroups,
    isLoadingLocations,
  ]);

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

  return (
    <Box sx={{ width: { xs: "325px", lg: "600px" }, overflowY: "auto" }}>
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
              type="number"
              id="semester"
              name="semester"
              label={t("rotations.semester")}
              value={formik.values.semester || ""}
              onChange={formik.handleChange}
              error={formik.touched.semester && Boolean(formik.errors.semester)}
              helperText={formik.touched.semester && formik.errors.semester}
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 2);
              }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="location_id"
              name="location_id"
              select
              label={t("locations.locationCapitalLetter")}
              value={formik.values.location_id || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.location_id && Boolean(formik.errors.location_id)
              }
              helperText={
                formik.touched.location_id && formik.errors.location_id
              }
            >
              {dataLocations ? (
                dataLocations?.map((location: LocationItem) => (
                  <MenuItem
                    key={location.location_id}
                    value={location.location_id}
                    onClick={() => setLocationId(location.location_id)}
                  >
                    {location.name}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="group_id"
              name="group_id"
              select
              label={t("groups.groupCapitalLetter")}
              value={formik.values.group_id || ""}
              onChange={formik.handleChange}
              error={formik.touched.group_id && Boolean(formik.errors.group_id)}
              helperText={formik.touched.group_id && formik.errors.group_id}
            >
              {dataGroups ? (
                dataGroups?.map((group: GroupItem) => (
                  <MenuItem
                    key={group.group_id}
                    value={group.group_id}
                    onClick={() =>
                      setGroupProfessorName(
                        group.professor_user.name +
                          " " +
                          group.professor_user.lastname
                      )
                    }
                  >
                    {group.name}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="group_professor"
              name="group_professor"
              disabled
              label={t("rotations.professorInCharge")}
              value={groupProfessorName || ""}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="date"
              id="start_date"
              name="start_date"
              label={t("rotations.startDate")}
              value={formik.values.start_date || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.start_date && Boolean(formik.errors.start_date)
              }
              helperText={formik.touched.start_date && formik.errors.start_date}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: moment(new Date()).format("YYYY-MM-DD") }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="date"
              id="finish_date"
              name="finish_date"
              label={t("rotations.finishDate")}
              value={formik.values.finish_date || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.finish_date && Boolean(formik.errors.finish_date)
              }
              helperText={
                formik.touched.finish_date && formik.errors.finish_date
              }
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: moment(new Date()).format("YYYY-MM-DD") }}
            />
          </Grid>
          <Grid item lg={12} xs={12}>
            <Divider flexItem sx={{ marginY: "10px" }} />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              select
              disabled={locationId === 0}
              id="speciality_id"
              name="speciality_id"
              label={t("specialities.speciality")}
              value={specialityId || ""}
              onChange={(e) => handleChangeSpecialities(e, "speciality_id")}
              error={touchedSpecialityId}
              helperText={
                touchedSpecialityId && t("commons.validations.requiredField")
              }
            >
              {dataSpecialities ? (
                dataSpecialities?.map((locationDetail: LocationDetailItem) => (
                  <MenuItem
                    key={locationDetail.location_speciality_id}
                    value={locationDetail.speciality.speciality_id}
                    onClick={() =>
                      setSpecialityDescription(
                        locationDetail.speciality.description
                      )
                    }
                  >
                    {locationDetail.speciality.description}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              select
              id="professor_id"
              name="professor_id"
              label={t("commons.professor")}
              disabled={specialityId === 0}
              value={professorId || ""}
              onChange={(e) => handleChangeSpecialities(e, "professor_id")}
              error={touchedProfessorId}
              helperText={
                touchedProfessorId && t("commons.validations.requiredField")
              }
            >
              {dataProfessors ? (
                dataProfessors?.map((professor: ProfessorItem) => (
                  <MenuItem
                    key={professor.user_id}
                    value={professor.user_id}
                    onClick={() =>
                      setProfessorName(
                        professor.name + " " + professor.lastname
                      )
                    }
                  >
                    {professor.name} {professor.lastname}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="number"
              id="number_weeks"
              name="semester"
              label={t("rotations.numberOfWeeks")}
              value={numberWeeks || ""}
              onChange={(e) => handleChangeSpecialities(e, "number_weeks")}
              error={touchedNumberWeeks}
              helperText={
                touchedNumberWeeks && t("commons.validations.requiredField")
              }
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 2);
              }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <AddButton
              disabled={
                specialityId === 0 || professorId === 0 || numberWeeks === 0
              }
              sx={{ marginRight: "10px" }}
              onClick={addRotationsSpecialitiesToList}
            />
          </Grid>
          <Grid item lg={12} xs={12}>
            {rotationsSpecialitiesList.length > 0 && (
              <RotationListComponent
                specialities={rotationsSpecialitiesList}
                deleteSpecialityFromList={deleteRotationSpecialityFromList}
              />
            )}
          </Grid>
          <Grid item lg={12} xs={12}>
            <Divider flexItem sx={{ marginY: "10px" }} />
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
              marginY: "10px",
              marginRight: "10px",
            }}
          >
            <CancelButton onClick={toggleDrawer} />
            <CreateButton disabled={rotationsSpecialitiesList.length === 0} />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
