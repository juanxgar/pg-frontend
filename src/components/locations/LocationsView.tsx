import {
  Breadcrumb,
  CreateButton,
  PageTitle,
  InputComponent,
  CleanSearchButton,
  DeleteButton,
  DrawerComponent,
  EditButtonOuted,
  InactivateButton,
  ModalComponent,
  SnackbarComponent,
  DetailButton,
  LocationCreation,
  LocationUpdate,
  LocationsTable,
} from "@/components";
import { LocationSearchSchema } from "@/schemas";
import {
  ContentModal,
  LocationItem,
  Navigator,
  PaginatedResult,
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
import { useLocation } from "@/hooks";
import { useRouter } from "next/navigation";

interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
}

export function LocationsView(props: Props): ReactElement {
  const { locale, setLoading } = props;
  const t = useTranslations();
  const {
    useAllLocationsWithPagination,
    useUpdateStateLocation,
    useDeleteLocation,
    errorStatus,
  } = useLocation();

  const router = useRouter();

  const [state, setState] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [nameDebounce, setNameDebounce] = useState<string>("");
  const [adressDebounce, setAdressDebounce] = useState<string>("");
  const [cityDebounce, setCityDebounce] = useState<string>("");
  const [complexityDebounce, setComplexityDebounce] = useState<string>("");
  const [stateDebounce, setStateDebounce] = useState<boolean>(true);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const [isLoadingCreation, setLoadingCreation] = useState<boolean>(true);
  const [isCreation, setCreation] = useState<boolean>(false);

  const [disabledButtons, setDisabledButtons] = useState<boolean>(true);

  const [location, setLocation] = useState<LocationItem>({
    location_id: 0,
    adress: "",
    city: "",
    complexity: "",
    name: "",
    total_capacity: 0,
    state: true,
  });

  const modalContentDelete: ContentModal = {
    title: t("modals.deleteTitle") + t("locations.location"),
    description: t("modals.deleteRegister"),
  };
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const [checked, setChecked] = useState<Array<boolean>>([]);

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/locations`, name: t("commons.locations") },
  ];

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      nameSearch: "",
      adressSearch: "",
      citySearch: "",
      complexitySearch: "",
      stateSearch: "true",
    },
    validationSchema: LocationSearchSchema(t),
    onSubmit: (values) => {},
  });

  const {
    data,
    isLoading,
    refetch,
  }: {
    data: PaginatedResult<LocationItem> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useAllLocationsWithPagination({
    name: nameDebounce,
    adress: adressDebounce,
    city: cityDebounce,
    complexity: complexityDebounce,
    state: stateDebounce,
    page,
    limit,
  });

  const {
    mutate,
    isSuccess,
    data: dataState,
    isLoading: isLoadingState,
    isError,
    error,
  } = useUpdateStateLocation();

  const {
    mutate: mutateDelete,
    isSuccess: isSuccessDelete,
    data: dataDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useDeleteLocation();

  const updateStateLocation = (location_id: number) => {
    mutate(location_id as unknown as string);
  };

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

  const handleState = (state: boolean) => {
    setState(state);
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
    mutateDelete(location.location_id as unknown as string);
    setChecked(Array(data?.data.length).fill(false));
    handleCloseModalDelete();
  };

  const cleanForm = () => {
    formik.resetForm();
    searchRefClear.current();
  };

  const searchRefName = useRef(
    debounce((value: string) => {
      setPage(0);
      setNameDebounce(value);
    }, 2000)
  );

  const handleSearchName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoading(true);
    searchRefName.current(event.target.value);
    setLoading(false);
    if (page) {
      return null;
    }
  };

  const searchRefAdress = useRef(
    debounce((value: string) => {
      setPage(0);
      setAdressDebounce(value);
    }, 2000)
  );

  const handleSearchAdress = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefAdress.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefCity = useRef(
    debounce((value: string) => {
      setPage(0);
      setCityDebounce(value);
    }, 2000)
  );

  const handleSearchCity = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefCity.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefComplexity = useRef(
    debounce((value: string) => {
      setPage(0);
      setComplexityDebounce(value);
    }, 2000)
  );

  const handleSearchComplexity = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefComplexity.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefState = useRef(
    debounce((value: string) => {
      setPage(0);
      setStateDebounce(value === "true");
    }, 2000)
  );

  const handleSearchState = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefState.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefClear = useRef(
    debounce(() => {
      setPage(0);
      setNameDebounce("");
      setAdressDebounce("");
      setCityDebounce("");
      setComplexityDebounce("");
      setStateDebounce(true);
    }, 2000)
  );

  useEffect(() => {
    if (isLoading) {
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
  }, [isLoading, errorStatus]);

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
    if (isSuccess) {
      setMessageSnackbar(dataState.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
      setChecked(Array(data?.data.length).fill(false));
    }

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
  }, [isLoadingState, isLoadingDelete]);

  useEffect(() => {
    if (isError) {
      if (error.status === 400) {
        setMessageSnackbar(error.data.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
    if (isErrorDelete) {
      if (errorDelete.status === 400) {
        setMessageSnackbar(errorDelete.data.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
  }, [isError, isErrorDelete]);

  return (
    <>
      <DrawerComponent
        open={openDrawer}
        toggleDrawer={toggleDrawer}
        title={
          isCreation
            ? t("locations.locationCreation")
            : t("locations.locationUpdate")
        }
        isLoading={isLoadingCreation}
      >
        {isCreation ? (
          <LocationCreation
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
          <LocationUpdate
            toggleDrawer={toggleDrawer}
            setLoading={setLoadingCreation}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            refetch={refetch}
            checked={checked}
            setChecked={setChecked}
            location_id={location.location_id as unknown as string}
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
            <PageTitle>{t("locations.locationsTitle")}</PageTitle>
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
              id="nameSearch"
              name="nameSearch"
              label={t("user.name")}
              value={formik.values.nameSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchName(e);
              }}
              error={
                formik.touched.nameSearch && Boolean(formik.errors.nameSearch)
              }
              helperText={formik.touched.nameSearch && formik.errors.nameSearch}
            />
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="adressSearch"
              name="adressSearch"
              label={t("locations.adress")}
              value={formik.values.adressSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchAdress(e);
              }}
              error={
                formik.touched.adressSearch &&
                Boolean(formik.errors.adressSearch)
              }
              helperText={
                formik.touched.adressSearch && formik.errors.adressSearch
              }
            />
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="citySearch"
              name="citySearch"
              label={t("locations.city")}
              value={formik.values.citySearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchCity(e);
              }}
              error={
                formik.touched.citySearch && Boolean(formik.errors.citySearch)
              }
              helperText={formik.touched.citySearch && formik.errors.citySearch}
            />
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="complexitySearch"
              name="complexitySearch"
              label={t("locations.complexity")}
              value={formik.values.citySearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchComplexity(e);
              }}
              error={
                formik.touched.citySearch && Boolean(formik.errors.citySearch)
              }
              helperText={formik.touched.citySearch && formik.errors.citySearch}
            />
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="stateSearch"
              name="stateSearch"
              select
              label={t("commons.active")}
              value={formik.values.stateSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchState(e);
              }}
              error={
                formik.touched.stateSearch && Boolean(formik.errors.stateSearch)
              }
              helperText={
                formik.touched.stateSearch && formik.errors.stateSearch
              }
            >
              <MenuItem value={"true"}>{t("commons.active")}</MenuItem>
              <MenuItem value={"false"}>{t("commons.inactive")}</MenuItem>
            </InputComponent>
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
            <DetailButton
              disabled={disabledButtons}
              onClick={() =>
                router.push(
                  `/${locale}/admin/locations/${location.location_id}`
                )
              }
            />
            <EditButtonOuted
              disabled={disabledButtons}
              onClick={() => {
                toggleDrawer();
                setCreation(false);
              }}
            />
            <InactivateButton
              state={state}
              buttonProps={{
                disabled: disabledButtons,
                onClick: () => updateStateLocation(location.location_id),
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
        <LocationsTable
          checked={checked}
          handleCheck={handleChecked}
          handleState={handleState}
          data={data}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          setLocation={setLocation}
        />
      )}
    </>
  );
}
