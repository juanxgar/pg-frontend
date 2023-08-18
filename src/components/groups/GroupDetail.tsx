import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import {
  BackButton,
  Breadcrumb,
  CleanSearchButton,
  InputComponent,
  PageTitle,
  SnackbarComponent,
} from "@/components";
import { AlertColor, Box, Grid, Typography, debounce } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  GroupDetailItem,
  GroupItem,
  Navigator,
  PaginatedResult,
} from "@/types";
import { UserSearchSchema } from "@/schemas";
import { useFormik } from "formik";
import { GroupDetailTable } from "./GroupDetailTable";
import { useGroup } from "@/hooks";
import { useRouter } from "next/navigation";

interface Props {
  locale: string;
  group_id: string;
  setLoading: (loading: boolean) => void;
}

export function GroupDetail(props: Props): ReactElement {
  const { locale, setLoading, group_id } = props;
  const t = useTranslations();
  const { useGroupDetailWithPagination, useSpecificGroup, errorStatus } =
    useGroup();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [nameDebounce, setNameDebounce] = useState<string>("");

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const router = useRouter();

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/groups`, name: t("commons.groups") },
    { ref: `/${locale}/admin/groups/detail`, name: t("commons.detail") },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      nameSearch: "",
    },
    validationSchema: UserSearchSchema(t),
    onSubmit: (values) => {},
  });

  const {
    data,
    isLoading,
  }: {
    data: PaginatedResult<GroupDetailItem> | undefined;
    isLoading: boolean;
  } = useGroupDetailWithPagination({
    group_id: +group_id,
    params: {
      name: nameDebounce,
      page,
      limit,
    },
  });

  const {
    data: dataGroup,
    isLoading: isLoadingGroup,
  }: {
    data: GroupItem | undefined;
    isLoading: boolean;
  } = useSpecificGroup(group_id);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

  const searchRefClear = useRef(
    debounce(() => {
      setPage(0);
      setNameDebounce("");
    }, 2000)
  );

  useEffect(() => {
    if (isLoading || isLoadingGroup) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (errorStatus === 401) {
      setMessageSnackbar(t("commons.sessionExpired"));
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
  }, [isLoading, isLoadingGroup, errorStatus]);
  return (
    <>
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
            <PageTitle>{t("groups.groupDetail")}</PageTitle>
          </Box>
        </Grid>
        <Grid item lg={6} xs={12}>
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
              <BackButton
                onClick={() => router.push(`/${locale}/admin/groups`)}
              />
              <CleanSearchButton clearFunction={cleanForm} />
            </Box>
            <Grid container marginTop="20px">
              <Grid item lg={6} xs={12}>
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
                    formik.touched.nameSearch &&
                    Boolean(formik.errors.nameSearch)
                  }
                  helperText={
                    formik.touched.nameSearch && formik.errors.nameSearch
                  }
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
        {!isLoadingGroup && (
          <Grid item lg={6} xs={12}>
            <Grid container>
              <Grid item lg={12} xs={12}>
                <Box
                  sx={{
                    float: { lg: "right", xs: "left" },
                    marginTop: "20px",
                  }}
                >
                  <Typography fontSize={{ lg: 20, xs: 16 }}>
                    <strong>{t("groups.groupName")}: </strong>
                    {dataGroup?.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={12} xs={12}>
                <Box
                  sx={{
                    float: { lg: "right", xs: "left" },
                    marginTop: "20px",
                  }}
                >
                  <Typography fontSize={{ lg: 20, xs: 16 }} marginTop="10px">
                    <strong>{t("groups.professorName")}: </strong>
                    {dataGroup?.professor_user.name}{" "}
                    {dataGroup?.professor_user.lastname}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      <GroupDetailTable
        data={data}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
}
