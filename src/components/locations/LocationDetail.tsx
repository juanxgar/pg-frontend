import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import {
  BackButton,
  Breadcrumb,
  CleanSearchButton,
  InputComponent,
  LocationDetailTable,
  PageTitle,
  SnackbarComponent,
} from "@/components";
import { AlertColor, Box, Grid, Typography, debounce } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  LocationDetailItem,
  LocationItem,
  Navigator,
  PaginatedResult,
} from "@/types";
import { SpecialitySearchSchema } from "@/schemas";
import { useFormik } from "formik";
import { useLocation } from "@/hooks";
import { useRouter } from "next/navigation";

interface Props {
  locale: string;
  location_id: string;
  setLoading: (loading: boolean) => void;
}

export function LocationDetail(props: Props): ReactElement {
  const { locale, setLoading, location_id } = props;
  const t = useTranslations();
  const { useLocationDetailWithPagination, useSpecificLocation, errorStatus } =
    useLocation();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [descriptionDebounce, setDescriptionDebounce] = useState<string>("");

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [severitySnackbar, setSeveritySnackbar] =
    useState<AlertColor>("success");

  const router = useRouter();

  const navigator: Array<Navigator> = [
    { ref: `/${locale}/home`, name: t("commons.home") },
    { ref: `/${locale}/admin/location`, name: t("commons.locations") },
    { ref: `/${locale}/admin/locations/detail`, name: t("commons.detail") },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      descriptionSearch: "",
    },
    validationSchema: SpecialitySearchSchema(t),
    onSubmit: (values) => {},
  });

  const {
    data,
    isLoading,
  }: {
    data: PaginatedResult<LocationDetailItem> | undefined;
    isLoading: boolean;
  } = useLocationDetailWithPagination({
    location_id: +location_id,
    params: {
      description: descriptionDebounce,
      page,
      limit,
    },
  });

  const {
    data: dataLocation,
    isLoading: isLoadingLocation,
  }: {
    data: LocationItem | undefined;
    isLoading: boolean;
  } = useSpecificLocation(location_id);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

  const searchRefClear = useRef(
    debounce(() => {
      setPage(0);
      setDescriptionDebounce("");
    }, 2000)
  );

  useEffect(() => {
    if (isLoading || isLoadingLocation) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (errorStatus === 401) {
      setMessageSnackbar(t("commons.sessionExpired"));
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
  }, [isLoading, isLoadingLocation, errorStatus]);
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
            <PageTitle>{t("locations.locationDetail")}</PageTitle>
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
                onClick={() => router.push(`/${locale}/admin/locations`)}
              />
              <CleanSearchButton clearFunction={cleanForm} />
            </Box>
            <Grid container marginTop="20px">
              <Grid item lg={6} xs={12}>
                <InputComponent
                  type="search"
                  id="descriptionSearch"
                  name="descriptionSearch"
                  label={t("specialities.description")}
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
            </Grid>
          </form>
        </Grid>
        {!isLoadingLocation && (
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
                    <strong>{t("user.name")}: </strong>
                    {dataLocation?.name}
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
                    <strong>{t("locations.complexity")}: </strong>
                    {dataLocation?.complexity}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      <LocationDetailTable
        data={data}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
}
