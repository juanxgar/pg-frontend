import {
  Box,
  FormControl,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Typography,
  SelectChangeEvent,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { ChangeEvent, ReactElement } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";

type Props = {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const rowsPerPageList = [5, 10, 30, 50];

export default function TablePagination(props: Props): ReactElement {
  const { currentPage, totalPages, rowsPerPage, setPage, setLimit } = props;
  const t = useTranslations();

  const onChangePage = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowPerPage = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
  };

  return (
    <Grid container padding={2}>
      <Grid item xs={5}>
        <Stack flex={1} direction="row" display={{ xs: "flex", sm: "flex" }}>
          <Stack
            alignItems="center"
            justifyContent="center"
            mr={2}
            display={{ xs: "none", lg: "flex" }}
          >
            <Typography
              fontSize={{ xs: "12px", sm: "12px", md: "12px" }}
              color="#AAAAAA"
              noWrap
              component="span"
            >
              {t("commons.show")}
            </Typography>
          </Stack>
          <Box>
            <FormControl size="small">
              <Select
                defaultValue={rowsPerPage}
                value={rowsPerPage}
                onChange={handleRowPerPage}
                color="primary"
                displayEmpty
              >
                {rowsPerPageList?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Grid>

      <Grid item xs={7} lg={7}>
        <Box
          sx={{
            float: "right",
          }}
        >
          <Pagination
            count={totalPages}
            defaultPage={currentPage}
            page={currentPage}
            onChange={onChangePage}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: Previous, next: Next }}
                {...item}
              />
            )}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

const Previous = () => {
  const t = useTranslations();
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Typography
      sx={{
        color: "#AAAAAA",
        fontSize: { xs: "12px", sm: "12px", md: "12px" },
        display: "flex",
        alignItems: "center",
      }}
      noWrap
      component="span"
    >
      {lg && t("commons.prev")} <ArrowLeftIcon />
    </Typography>
  );
};

const Next = () => {
  const t = useTranslations();
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Typography
      sx={{
        color: "#AAAAAA",
        fontSize: { xs: "12px", sm: "12px", md: "12px" },
        display: "flex",
        alignItems: "center",
      }}
      noWrap
      component="span"
      color="primary"
    >
      <ArrowRightIcon /> {lg && t("commons.next")}
    </Typography>
  );
};
