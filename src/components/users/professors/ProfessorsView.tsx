"use client";

import Breadcrumb from "@/components/general/Breadcrumb";
import CreateButton from "@/components/general/CreateButton";
import PageTitle from "@/components/general/PageTitle";
import InputComponent from "@/components/general/InputComponent";
import { UserSearchSchema } from "@/schemas";
import { ContentModal, Navigator } from "@/types";
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
import ProfessorsTable from "./ProfessorsTable";
import { useTheme } from "@mui/material/styles";
import CleanSearchButton from "@/components/general/CleanSearchButton";
import EditButtonOuted from "@/components/general/EditButtonOuted";
import InactivateButton from "@/components/general/InactivateButton";
import DeleteButton from "@/components/general/DeleteButton";
import { useUser } from "@/hooks/user.queries";
import DrawerComponent from "@/components/general/DrawerComponent";
import ProfessorCreation from "./ProfessorCreation";
import SnackbarComponent from "@/components/general/SnackbarComponent";
import ProfessorUpdate from "./ProfessorUpdate";
import { PaginatedResult } from "@/types/result.types";
import { ProfessorItem } from "@/types/entities.type";
import ModalComponent from "@/components/general/ModalComponent";

interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
}

export default function ProfessorsView(props: Props): ReactElement {
  const { locale, setLoading } = props;
  const t = useTranslations();
  const {
    useAllProfessorsWithPagination,
    useUpdateStateUser,
    useDeleteUser,
    errorStatus,
  } = useUser();

  const [state, setState] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [nameDebounce, setNameDebounce] = useState<string>("");
  const [emailDebounce, setEmailDebounce] = useState<string>("");
  const [codeDebounce, setCodeDebounce] = useState<string>("");
  const [stateDebounce, setStateDebounce] = useState<boolean>(true);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const [isLoadingCreation, setLoadingCreation] = useState<boolean>(true);
  const [isCreation, setCreation] = useState<boolean>(false);

  const [disabledButtons, setDisabledButtons] = useState<boolean>(true);

  const [dataProfessor, setDataProfessor] = useState<ProfessorItem>({
    user_id: 0,
    name: "",
    lastname: "",
    identification: 0,
    role: "",
    code: "",
    email: "",
    state: true,
    professor_speciality: [],
  });

  const modalContentDelete = {
    title: t("modals.deleteTitle") + t("user.user"),
    description: t("modals.deleteRegister"),
  };
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const [checked, setChecked] = useState<Array<boolean>>([]);

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/users`, name: t("commons.users") },
  ];

  const theme: Theme = useTheme();
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      nameSearch: "",
      emailSearch: "",
      codeSearch: "",
      stateSearch: "true",
    },
    validationSchema: UserSearchSchema(t),
    onSubmit: (values) => {},
  });

  const {
    data,
    isLoading,
    refetch,
  }: {
    data: PaginatedResult<ProfessorItem> | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useAllProfessorsWithPagination({
    name: nameDebounce,
    email: emailDebounce,
    code: codeDebounce,
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
  } = useUpdateStateUser();

  const {
    mutate: mutateDelete,
    isSuccess: isSuccessDelete,
    data: dataDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useDeleteUser();

  const updateStateUser = (user_id: number) => {
    mutate(user_id as unknown as string);
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
    setOpenDrawer(!openDrawer);
  };

  const handleCloseModalDelete = () => {
    setOpenModalDelete(!openModalDelete);
  };

  const onSubmitModalDelete = () => {
    mutateDelete(dataProfessor.user_id as unknown as string);
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

  const searchRefEmail = useRef(
    debounce((value: string) => {
      setPage(0);
      setEmailDebounce(value);
    }, 2000)
  );

  const handleSearchEmail = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefEmail.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefCode = useRef(
    debounce((value: string) => {
      setPage(0);
      setCodeDebounce(value);
    }, 2000)
  );

  const handleSearchCode = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    searchRefCode.current(event.target.value);
    if (page) {
      return null;
    }
  };

  const searchRefState = useRef(
    debounce((value: string) => {
      setPage(0);
      setStateDebounce(value === "true" ? true : false);
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
      setCodeDebounce("");
      setEmailDebounce("");
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
    }
    if (isLoadingCreation) {
      setLoading(true);
    } else {
      setLoading(false);
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
          isCreation ? t("user.professorCreation") : t("user.professorUpdate")
        }
        isLoading={isLoadingCreation}
      >
        {isCreation ? (
          <ProfessorCreation
            toggleDrawer={toggleDrawer}
            setLoading={setLoadingCreation}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            refetch={refetch}
          />
        ) : (
          <ProfessorUpdate
            toggleDrawer={toggleDrawer}
            setLoading={setLoadingCreation}
            setMessageSnackbar={setMessageSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            setSeveritySnackbar={setSeveritySnackbar}
            refetch={refetch}
            dataProfessor={dataProfessor}
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
            <PageTitle>{t("user.professorsTitle")}</PageTitle>
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
              value={formik.values.nameSearch || ""}
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
              id="emailSearch"
              name="emailSearch"
              label={t("user.email")}
              value={formik.values.emailSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchEmail(e);
              }}
              error={
                formik.touched.emailSearch && Boolean(formik.errors.emailSearch)
              }
              helperText={
                formik.touched.emailSearch && formik.errors.emailSearch
              }
            />
          </Grid>
          <Grid item lg={2} xs={6}>
            <InputComponent
              type="search"
              id="codeSearch"
              name="codeSearch"
              label={t("user.code")}
              value={formik.values.codeSearch}
              onChange={(e) => {
                formik.handleChange(e);
                handleSearchCode(e);
              }}
              error={
                formik.touched.codeSearch && Boolean(formik.errors.codeSearch)
              }
              helperText={formik.touched.codeSearch && formik.errors.codeSearch}
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
            <Grid item lg={4} xs={12}>
              <CreateButton
                onClick={() => {
                  toggleDrawer();
                  setCreation(true);
                }}
              />
            </Grid>
          )}

          <Grid item lg={12} xs={8} marginTop="20px" marginBottom="10px">
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
                onClick: () => updateStateUser(dataProfessor.user_id),
              }}
            />
            <DeleteButton
              disabled={disabledButtons}
              onClick={handleCloseModalDelete}
            />
          </Grid>
          {!lg && (
            <Grid item lg={12} xs={4} marginTop="20px" marginBottom="10px">
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
        <ProfessorsTable
          checked={checked}
          handleCheck={handleChecked}
          handleState={handleState}
          data={data}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          setDataProfessor={setDataProfessor}
        />
      )}
    </>
  );
}
