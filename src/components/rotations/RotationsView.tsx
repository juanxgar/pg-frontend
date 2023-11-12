import {
  Breadcrumb,
  CreateButton,
  PageTitle,
  InputComponent,
  CleanSearchButton,
  DeleteButton,
  DrawerComponent,
  EditButtonOuted,
  ModalComponent,
  SnackbarComponent,
  RotationsTable,
  RotationCreation,
  RotationUpdate,
  CreateButtonOuted,
} from "@/components";
import { RotationSearchSchema } from "@/schemas";
import {
  ContentModal,
  GroupItem,
  LocationItem,
  Navigator,
  PaginatedResult,
  RotationItem,
} from "@/types";
import {
  AlertColor,
  Box,
  Grid,
  MenuItem,
  Theme,
  debounce,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "@mui/material/styles";
import { useGroup, useLocation, useRotation } from "@/hooks";
import { useRouter } from "next/navigation";

interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
}

export function RotationsView(props: Props): ReactElement {
  const { locale, setLoading } = props;
  const t = useTranslations();
  const { useAllGroups } = useGroup();
  const { useAllLocations } = useLocation();
  const { useAllRotationsWithPagination, useDeleteRotation, errorStatus } =
    useRotation();

  const router = useRouter();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [groupIdDebounce, setGroupIdDebounce] = useState<number>(0);
  const [locationIdDebounce, setLocationIdDebounce] = useState<number>(0);
  const [startDateDebounce, setStartDateDebounce] = useState<string>("");
  const [finishDateDebounce, setFinishDateDebounce] = useState<string>("");
  const [semesterDebounce, setSemesterDebounce] = useState<
    number | undefined
  >();

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const [isLoadingCreation, setLoadingCreation] = useState<boolean>(true);
  const [isCreation, setCreation] = useState<boolean>(false);

  const [disabledButtons, setDisabledButtons] = useState<boolean>(true);

  const [rotation, setRotation] = useState<RotationItem>({
    rotation_id: 0,
    semester: 0,
    start_date: new Date(),
    finish_date: new Date(),
    state: false,
    group: {
      group_id: 0,
      name: "",
      professor_user: {
        code: "",
        email: "",
        identification: 0,
        lastname: "",
        name: "",
        professor_speciality: [
          {
            speciality: {
              description: "",
              speciality_id: 0,
              state: true,
            },
          },
        ],
        role: "Docente",
        state: true,
        user_id: 0,
      },
      state: true,
    },
    location: {
      location_id: 0,
      adress: "",
      city: "",
      complexity: "",
      name: "",
      total_capacity: 0,
      state: true,
    },
  });

  const modalContentDelete: ContentModal = {
    title: t("modals.deleteTitle") + t("rotations.rotation"),
    description: t("modals.deleteRegister"),
  };
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const [checked, setChecked] = useState<Array<boolean>>([]);

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/users`, name: t("commons.rotations") },
  ];

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      groupIdSearch: "",
      locationIdSearch: "",
      startDateSearch: "",
      finishDateSearch: "",
      semesterSearch: "",
    },
    validationSchema: RotationSearchSchema(t),
    onSubmit: (values) => {},
  });

  const {
    data,
    isLoading,
    refetch,
  }: {
    data: PaginatedResult<RotationItem> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useAllRotationsWithPagination({
    group_id: groupIdDebounce,
    location_id: locationIdDebounce,
    start_date: startDateDebounce,
    finish_date: finishDateDebounce,
    semester: semesterDebounce,
    page,
    limit,
  });

  const {
    data: dataGroups,
    isLoading: isLoadingGroups,
  }: {
    data: Array<GroupItem> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useAllGroups({
    state: true,
  });

  const {
    data: dataLocations,
    isLoading: isLoadingLocations,
  }: {
    data: Array<LocationItem> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useAllLocations({
    state: true,
  });

  const {
    mutate: mutateDelete,
    isSuccess: isSuccessDelete,
    data: dataDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useDeleteRotation();

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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleDrawer = () => {
    if (!openDrawer) {
      setLoadingCreation(true);
    }
    setOpenDrawer(!openDrawer);
  };

  const handleCloseModalDelete = () => {
    setOpenModalDelete(!openModalDelete);
  };

  const onSubmitModalDelete = () => {
    mutateDelete(rotation.rotation_id as unknown as string);
    setChecked(Array(data?.data.length).fill(false));
    handleCloseModalDelete();
  };

  const cleanForm = () => {
    formik.resetForm();
    searchRefClear.current();
  };

  const searchRefGroupId = useRef(
    debounce((value: number) => {
      setPage(0);
      setGroupIdDebounce(value);
    }, 2000)
  );

  const handleSearchGroupId = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoading(true);
    searchRefGroupId.current(+event.target.value);
    setLoading(false);
    if (page) {
      return null;
    }
  };

  const searchRefLocationId = useRef(
    debounce((value: number) => {
      setPage(0);
      setLocationIdDebounce(value);
    }, 2000)
  );

  const handleSearchLocationId = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefLocationId.current(+event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefStartDate = useRef(
    debounce((value: string) => {
      setPage(0);
      setStartDateDebounce(value);
    }, 2000)
  );

  const handleSearchStartDate = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefStartDate.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefFinishDate = useRef(
    debounce((value: string) => {
      setPage(0);
      setStartDateDebounce(value);
    }, 2000)
  );

  const handleSearchFinishDate = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefFinishDate.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefSemester = useRef(
    debounce((value: number) => {
      setPage(0);
      setSemesterDebounce(value);
    }, 2000)
  );

  const handleSearchSemester = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefSemester.current(+event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefClear = useRef(
    debounce(() => {
      setPage(0);
      setGroupIdDebounce(0);
      setLocationIdDebounce(0);
      setStartDateDebounce("");
      setFinishDateDebounce("");
      setSemesterDebounce(0);
    }, 2000)
  );

  useEffect(() => {
    if (isLoading || isLoadingGroups || isLoadingLocations) {
      setLoading(true);
    } else {
      setChecked(Array(data?.data.length).fill(false));
      setLoading(false);
    }
    if (errorStatus === 401) {
      setMessageSnackbar(t("commons.sessionExpired"));
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
  }, [isLoading, isLoadingGroups, isLoadingLocations, errorStatus]);

  useEffect(() => {
    setChecked(Array(data?.data.length).fill(false));
  }, [page]);

  useEffect(() => {
    if (checked.includes(true)) {
      setDisabledButtons(false);
    } else {
      setDisabledButtons(true);
    }
  }, [checked]);

  useEffect(() => {
    if (isSuccessDelete) {
      setMessageSnackbar(dataDelete.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
    }
    if (isLoadingDelete) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoadingDelete]);

  useEffect(() => {
    if (isErrorDelete) {
      if (errorDelete.status === 400) {
        setMessageSnackbar(errorDelete.data.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
  }, [isErrorDelete]);

  return (
    <>
      <DrawerComponent
        open={openDrawer}
        toggleDrawer={toggleDrawer}
        title={
          isCreation
            ? t("rotations.rotationCreation")
            : t("rotations.rotationUpdate")
        }
        isLoading={isLoadingCreation}
      >
        {isCreation ? (
          <RotationCreation
            toggleDrawer={toggleDrawer}
            setLoading={setLoadingCreation}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            refetch={refetch}
            checked={checked}
            setChecked={setChecked}
          />
        ) : (
          <RotationUpdate
            toggleDrawer={toggleDrawer}
            setLoading={setLoadingCreation}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            refetch={refetch}
            checked={checked}
            setChecked={setChecked}
            rotation_id={rotation.rotation_id as unknown as string}
          />
        )}
      </DrawerComponent>
      <ModalComponent
        open={openModalDelete}
        onClose={handleCloseModalDelete}
        content={modalContentDelete}
        onSubmit={onSubmitModalDelete}
      />
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
            <PageTitle>{t("rotations.rotationsTitle")}</PageTitle>
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
        </Box>
        <Grid container marginTop="20px">
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="groupIdSearch"
              name="groupIdSearch"
              select
              label={t("groups.groupCapitalLetter")}
              value={formik.values.groupIdSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchGroupId(e);
              }}
              error={
                formik.touched.groupIdSearch &&
                Boolean(formik.errors.groupIdSearch)
              }
              helperText={
                formik.touched.groupIdSearch && formik.errors.groupIdSearch
              }
            >
              {dataGroups ? (
                dataGroups?.map((group: GroupItem) => (
                  <MenuItem key={group.group_id} value={group.group_id}>
                    {group.name}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="locationIdSearch"
              name="locationIdSearch"
              select
              label={t("locations.locationCapitalLetter")}
              value={formik.values.locationIdSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchLocationId(e);
              }}
              error={
                formik.touched.locationIdSearch &&
                Boolean(formik.errors.locationIdSearch)
              }
              helperText={
                formik.touched.locationIdSearch &&
                formik.errors.locationIdSearch
              }
            >
              {dataLocations ? (
                dataLocations?.map((location: LocationItem) => (
                  <MenuItem
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.name}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="date"
              id="startDateSearch"
              name="startDateSearch"
              label={t("rotations.startDate")}
              value={formik.values.startDateSearch || ""}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchStartDate(e);
              }}
              error={
                formik.touched.startDateSearch &&
                Boolean(formik.errors.startDateSearch)
              }
              helperText={
                formik.touched.startDateSearch && formik.errors.startDateSearch
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="date"
              id="finishDateSearch"
              name="finishDateSearch"
              label={t("rotations.finishDate")}
              value={formik.values.finishDateSearch || ""}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchFinishDate(e);
              }}
              error={
                formik.touched.finishDateSearch &&
                Boolean(formik.errors.finishDateSearch)
              }
              helperText={
                formik.touched.finishDateSearch &&
                formik.errors.finishDateSearch
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item lg={2} xs={12}>
            <InputComponent
              type="number"
              id="semesterSearch"
              name="semesterSearch"
              label={t("rotations.semester")}
              value={formik.values.semesterSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchSemester(e);
              }}
              error={
                formik.touched.semesterSearch &&
                Boolean(formik.errors.semesterSearch)
              }
              helperText={
                formik.touched.semesterSearch && formik.errors.semesterSearch
              }
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 2);
              }}
            />
          </Grid>
          {lg && (
            <Grid item lg={2} xs={12}>
              <CreateButton
                onClick={() => {
                  toggleDrawer();
                  setCreation(true);
                }}
              />
            </Grid>
          )}

          <Grid item lg={12} xs={9} marginTop="20px" marginBottom="10px">
            <CreateButtonOuted
              disabled={disabledButtons}
              onClick={() => {
                router.push(
                  `/${locale}/admin/rotations/${rotation.rotation_id}`
                );
              }}
            />
            <EditButtonOuted
              disabled={disabledButtons}
              onClick={() => {
                toggleDrawer();
                setCreation(false);
              }}
            />
            <DeleteButton
              disabled={disabledButtons}
              onClick={handleCloseModalDelete}
            />
          </Grid>
          {!lg && (
            <Grid item lg={12} xs={3} marginTop="20px" marginBottom="10px">
              <CreateButton
                onClick={() => {
                  toggleDrawer();
                  setCreation(true);
                }}
              />
            </Grid>
          )}
        </Grid>
      </form>

      {!isLoading && (
        <RotationsTable
          checked={checked}
          handleCheck={handleChecked}
          data={data}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          setRotation={setRotation}
        />
      )}
    </>
  );
}
