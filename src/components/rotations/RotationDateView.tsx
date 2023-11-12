import React, { ReactElement, useEffect, useState } from "react";
import {
  AlertColor,
  Box,
  CssBaseline,
  Grid,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  Breadcrumb,
  DrawerComponent,
  EditButtonOuted,
  PageTitle,
  RotationDateCreation,
  RotationDatesTable,
  SnackbarComponent,
} from "@/components";
import {
  DatesRotationDatesResult,
  FormikRotationDateCreation,
  FormikRotationDateCreationDates,
  GroupItem,
  Navigator,
  RotationItem,
  RotationSpecialityItem,
  StudentRotation,
  StudentRotationDatesResult,
  UsedRotationDatesBySpeciality,
  UserItem,
} from "@/types";
import { useTranslations } from "next-intl";
import { useGroup, useRotation } from "@/hooks";
import moment from "moment";
import { Theme, useTheme } from "@mui/material/styles";
interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
  rotation_id: string;
}

export function RotationDateView(props: Props): ReactElement {
  const { locale, setLoading, rotation_id } = props;

  const {
    useSpecificRotation,
    useDatesRotations,
    useStudentRotationDates,
    useUsedDatesFromSpecialities,
    useStudentsRotationDates,
  } = useRotation();
  const { useSpecificGroup } = useGroup();

  const t = useTranslations();

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/rotations`, name: t("commons.rotations") },
    {
      ref: `/${locale}/admin/rotations/dates-creation`,
      name: t("rotations.rotationDate"),
    },
  ];

  const [groupId, setGroupId] = useState<number>(0);
  const [checked, setChecked] = useState<Array<boolean>>([]);
  const [student, setStudent] = useState<StudentRotation>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [disabledButtons, setDisabledButtons] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");
  const [rotationDates, setRotationDates] = useState<
    Array<FormikRotationDateCreationDates>
  >([]);

  const {
    data: dataRotation,
    isLoading: isLoadingRotation,
  }: {
    data?: RotationItem;
    isLoading: boolean;
  } = useSpecificRotation(rotation_id);

  const [initialValues, setInitialValues] =
    useState<FormikRotationDateCreation>({
      rotation_id: dataRotation?.rotation_id || 0,
      student_user_id: student?.student_user_id || 0,
      rotation_dates: [],
    });

  const {
    data: dataDates,
    isLoading: isLoadingDates,
  }: {
    data: Array<DatesRotationDatesResult> | undefined;
    isLoading: boolean;
  } = useDatesRotations(rotation_id);

  const {
    data: dataStudentsDates,
    isLoading: isLoadingStudentsDates,
    refetch: refetchStudentsDates,
  }: {
    data: Array<StudentRotation> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useStudentsRotationDates(rotation_id);

  const {
    data: dataGroup,
    isLoading: isLoadingGroup,
    refetch: refetchGroup,
  }: {
    data?: GroupItem;
    isLoading: boolean;
    isSuccess: boolean;
    refetch: () => void;
  } = useSpecificGroup(groupId as unknown as string, false);

  const {
    data: dataRotationDates,
    isLoading: isLoadingRotationDates,
    refetch: refetchRotationDates,
  }: {
    data: Array<StudentRotationDatesResult> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useStudentRotationDates({
    rotationId: rotation_id as unknown as string,
    studentId: student?.student_user_id as unknown as string,
  });

  const {
    data: dataUsedDatesSpecialities,
    isLoading: isLoadingUsedDatesSpecialities,
    refetch: refetchUsedDatesSpecialities,
  }: {
    data: Array<UsedRotationDatesBySpeciality> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useUsedDatesFromSpecialities(rotation_id as unknown as string);

  const handleChecked = (index: number) => {
    const isChecked = checked.map((e, i) => {
      if (i === index) {
        return !e;
      } else {
        return false;
      }
    });
    setChecked(isChecked);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const updateChecked = () => {
    setChecked(Array(dataGroup?.group_detail?.length).fill(false));
  };

  useEffect(() => {
    if (!isLoadingRotation && !isLoadingDates && !isLoadingGroup) {
      if (dataRotation) {
        setGroupId(dataRotation.group.group_id);
      }
      setLoading(false);
    }
    if (groupId != 0) {
      refetchGroup();
    }
  }, [isLoadingRotation, isLoadingDates, isLoadingGroup, groupId]);

  useEffect(() => {
    setChecked(Array(dataGroup?.group_detail?.length).fill(false));
  }, [dataGroup]);

  useEffect(() => {
    if (checked.includes(true)) {
      setDisabledButtons(false);
    } else {
      setDisabledButtons(true);
    }
    if (openDrawer) {
      setDisabledButtons(true);
    }
  }, [checked, openDrawer]);

  useEffect(() => {
    if (student && rotation_id) {
      refetchRotationDates();
      refetchUsedDatesSpecialities();
    }
  }, [student, rotation_id]);

  useEffect(() => {
    if (!isLoadingRotationDates && !isLoadingRotation) {
      if (
        dataRotationDates &&
        dataRotation &&
        dataRotation.rotation_speciality &&
        student
      ) {
        let rotationDates: Array<FormikRotationDateCreationDates>;
        if (dataRotationDates.length === 0) {
          rotationDates = dataRotation.rotation_speciality.map(
            (speciality: RotationSpecialityItem) => {
              return {
                rotation_speciality_id: speciality.rotation_speciality_id,
                start_date: null,
                finish_date: null,
              };
            }
          );
          setRotationDates(rotationDates);
        } else {
          rotationDates = dataRotationDates.map(
            (date: StudentRotationDatesResult) => {
              return {
                rotation_speciality_id:
                  date.rotation_speciality.rotation_speciality_id,
                start_date: moment(date.start_date, "YYYY-MM-DD"),
                finish_date: moment(date.finish_date, "YYYY-MM-DD"),
              };
            }
          );
          setRotationDates(rotationDates);
        }
        setInitialValues({
          rotation_id: +rotation_id,
          student_user_id: student.student_user_id,
          rotation_dates: rotationDates,
        });
      }
    }
  }, [isLoadingRotationDates, isLoadingRotation, student]);

  useEffect(() => {
    if (rotation_id && student && rotationDates.length > 0) {
      setInitialValues({
        rotation_id: +rotation_id,
        student_user_id: student.student_user_id,
        rotation_dates: rotationDates,
      });
    }
  }, [rotation_id, student, rotationDates]);

  return (
    <>
      <CssBaseline />
      <Box>
        <DrawerComponent
          open={openDrawer}
          toggleDrawer={toggleDrawer}
          title={t("rotations.updateDates")}
          isLoading={isLoadingDates}
          isCreationDate={true}
        >
          <RotationDateCreation
            checked={checked}
            refetch={refetchGroup}
            setChecked={setChecked}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            student={student}
            toggleDrawer={toggleDrawer}
            updateChecked={updateChecked}
            dataRotation={dataRotation}
            dataUsedDatesSpecialities={dataUsedDatesSpecialities}
            isLoadingRotationDates={isLoadingRotationDates}
            dataRotationDates={dataRotationDates}
            initialValues={initialValues}
            dataDates={dataDates}
            refetchStudentsDates={refetchStudentsDates}
          />
        </DrawerComponent>
        <SnackbarComponent
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
          severity={severitySnackbar}
          message={messageSnackbar}
        />
        <Main open={openDrawer} lg={lg}>
          <>
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
                  <PageTitle>{t("rotations.rotationDateCreation")}</PageTitle>
                </Box>
              </Grid>
              <Grid container>
                <Grid item lg={12} xs={12}>
                  <Box
                    sx={{
                      float: { lg: "right", xs: "left" },
                      marginTop: "20px",
                    }}
                  >
                    <Typography fontSize={{ lg: 20, xs: 16 }}>
                      <strong>{t("locations.locationCapitalLetter")}: </strong>
                      {dataRotation?.location.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Box
                    sx={{
                      float: { lg: "right", xs: "left" },
                    }}
                  >
                    <Typography fontSize={{ lg: 20, xs: 16 }}>
                      <strong>{t("rotations.semester")}: </strong>
                      {dataRotation?.semester}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Box
                    sx={{
                      float: { lg: "right", xs: "left" },
                    }}
                  >
                    <Typography fontSize={{ lg: 20, xs: 16 }}>
                      <strong>{t("rotations.startDate")}: </strong>
                      {moment(dataRotation?.start_date, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Box
                    sx={{
                      float: { lg: "right", xs: "left" },
                    }}
                  >
                    <Typography fontSize={{ lg: 20, xs: 16 }}>
                      <strong>{t("rotations.finishDate")}: </strong>
                      {moment(dataRotation?.finish_date, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid item lg={12} xs={12}>
                <EditButtonOuted
                  disabled={disabledButtons}
                  onClick={toggleDrawer}
                />
              </Grid>
            </Grid>
            {!isLoadingDates && !isLoadingGroup && (
              <RotationDatesTable
                checked={checked}
                handleCheck={handleChecked}
                setStudent={setStudent}
                dataDates={dataDates}
                dataStudents={dataStudentsDates}
              />
            )}
          </>
        </Main>
      </Box>
    </>
  );
}

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "lg",
})<{
  open?: boolean;
  lg?: boolean;
}>(({ theme, open, lg }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: lg ? 470 : 0,
  }),
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative",
}));
