import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  CleanSearchButton,
  CreateButton,
  DeleteButton,
  DrawerComponent,
  EditButtonOuted,
  InactivateButton,
  InputComponent,
  ModalComponent,
  PageTitle,
  SnackbarComponent,
  SpecialitiesTable,
  SpecialityCreation,
  SpecialityUpdate,
} from "@/components";
import {
  AlertColor,
  Box,
  Grid,
  MenuItem,
  debounce,
  useMediaQuery,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import {
  ContentModal,
  Navigator,
  PaginatedResult,
  SpecialityItem,
} from "@/types";
import { SpecialitySearchSchema } from "@/schemas";
import { useFormik } from "formik";
import { useSpeciality } from "@/hooks";

interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
}

export function SpecialititiesView(props: Props): ReactElement {
  const { locale, setLoading } = props;
  const t = useTranslations();
  const {
    useAllSpecialitiesWithPagination,
    useUpdateStateSpeciality,
    useDeleteSpeciality,
    errorStatus,
  } = useSpeciality();

  const [state, setState] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [descriptionDebounce, setDescriptionDebounce] = useState<string>("");
  const [stateDebounce, setStateDebounce] = useState<boolean>(true);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const [isCreation, setCreation] = useState<boolean>(false);

  const [disabledButtons, setDisabledButtons] = useState<boolean>(true);

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const [checked, setChecked] = useState<Array<boolean>>([]);

  const [speciality, setSpeciality] = useState<SpecialityItem>({
    description: "",
    speciality_id: 0,
    state: false,
  });

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/specialities`, name: t("commons.specialities") },
  ];

  const modalContentDelete: ContentModal = {
    title: t("modals.deleteTitle") + t("groups.group"),
    description: t("modals.deleteRegister"),
  };

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      descriptionSearch: "",
      stateSearch: "true",
    },
    validationSchema: SpecialitySearchSchema(t),
    onSubmit: (values) => {},
  });

  const {
    data,
    isLoading,
    refetch,
  }: {
    data: PaginatedResult<SpecialityItem> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useAllSpecialitiesWithPagination({
    description: descriptionDebounce,
    state: stateDebounce,
    limit,
    page,
  });

  const {
    mutate,
    isSuccess,
    data: dataState,
    isLoading: isLoadingState,
    isError,
    error,
  } = useUpdateStateSpeciality();

  const {
    mutate: mutateDelete,
    isSuccess: isSuccessDelete,
    data: dataDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useDeleteSpeciality();

  const updateStateSpeciality = (speciality_id: number) => {
    mutate(speciality_id as unknown as string);
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

  const updateCheked = () => {
    setChecked(Array(data?.data.length).fill(false));
  };

  const handleState = (state: boolean) => {
    setState(state);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleCloseModalDelete = () => {
    setOpenModalDelete(!openModalDelete);
  };

  const onSubmitModalDelete = () => {
    mutateDelete(speciality.speciality_id as unknown as string);
    setChecked(Array(data?.data.length).fill(false));
    handleCloseModalDelete();
  };

  const cleanForm = () => {
    formik.resetForm();
    searchRefClear.current();
  };

  const searchRefDescription = useRef(
    debounce((value: string) => {
      setPage(0);
      setDescriptionDebounce(value);
    }, 2000)
  );

  const handleSearchDescription = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoading(true);
    searchRefDescription.current(event.target.value);
    setLoading(false);
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
      setDescriptionDebounce("");
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
      <SnackbarComponent
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
      />
      <ModalComponent
        open={openModalDelete}
        onClose={handleCloseModalDelete}
        content={modalContentDelete}
        onSubmit={onSubmitModalDelete}
      />
      <DrawerComponent
        open={openDrawer}
        toggleDrawer={toggleDrawer}
        title={
          isCreation
            ? t("specialities.specialityCreation")
            : t("specialities.specialityUpdate")
        }
      >
        {isCreation ? (
          <SpecialityCreation
            checked={checked}
            refetch={refetch}
            setChecked={setChecked}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            toggleDrawer={toggleDrawer}
            updateChecked={updateCheked}
          />
        ) : (
          <SpecialityUpdate
            refetch={refetch}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            toggleDrawer={toggleDrawer}
            dataSpeciality={speciality}
            updateChecked={updateCheked}
          />
        )}
      </DrawerComponent>
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
            <PageTitle>{t("specialities.specialitiesTitle")}</PageTitle>
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
              id="descriptionSearch"
              name="descriptionSearch"
              label={t("user.name")}
              value={formik.values.descriptionSearch || ""}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchDescription(e);
              }}
              error={
                formik.touched.descriptionSearch &&
                Boolean(formik.errors.descriptionSearch)
              }
              helperText={
                formik.touched.descriptionSearch &&
                formik.errors.descriptionSearch
              }
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
            <Grid item lg={8} xs={12}>
              <CreateButton
                onClick={() => {
                  toggleDrawer();
                  setCreation(true);
                }}
              />
            </Grid>
          )}
          <Grid item lg={12} xs={9} marginTop="20px" marginBottom="10px">
            <EditButtonOuted
              disabled={disabledButtons}
              onClick={() => {
                setCreation(false);
                toggleDrawer();
              }}
            />
            <InactivateButton
              state={state}
              buttonProps={{
                disabled: disabledButtons,
                onClick: () => updateStateSpeciality(speciality.speciality_id),
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
        <SpecialitiesTable
          checked={checked}
          handleCheck={handleChecked}
          handleState={handleState}
          data={data}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          setSpeciality={setSpeciality}
        />
      )}
    </>
  );
}
