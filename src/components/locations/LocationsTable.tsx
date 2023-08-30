import { StyledTableCell, TablePagination } from "@/components";
import { PaginatedResult, LocationItem } from "@/types";
import { Check, CloseSharp } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

interface Props {
  checked: Array<boolean>;
  handleCheck: (index: number) => void;
  handleState: (index: boolean) => void;
  data?: PaginatedResult<LocationItem>;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  setLocation: (location: LocationItem) => void;
}
export function LocationsTable(props: Props): ReactElement {
  const {
    checked,
    handleCheck,
    handleState,
    data,
    setPage,
    limit,
    setLimit,
    setLocation,
  } = props;
  const t = useTranslations();

  return (
    <>
      <TableContainer sx={{ marginTop: "2px" }}>
        <Table sx={{ minWidth: "700px", tableLayout: "fixed" }} stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell
                align="center"
                sx={{ width: { lg: "100px", xs: "50px" } }}
              >
                {t("commons.number")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "250px" }}>
                {t("user.name")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("locations.adress")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("locations.city")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("locations.capacity")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("locations.complexity")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("commons.active")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((location: LocationItem, index: number) => (
              <TableRow
                key={location.location_id}
                selected={checked[index]}
                onClick={() => {
                  handleCheck(index);
                  setLocation(location);
                  handleState(location.state);
                }}
              >
                <StyledTableCell
                  align="center"
                  sx={{ width: { lg: "100px", xs: "50px" } }}
                >
                  <Typography fontWeight="500">
                    {(data.meta.currentPage - 1) * data.meta.perPage +
                      (index + 1)}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {location.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {location.adress}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {location.city}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {location.total_capacity}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {location.complexity}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {location.state ? (
                    <Check color="success" />
                  ) : (
                    <CloseSharp color="warning" />
                  )}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && data?.meta.lastPage >= 1 && (
        <TablePagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.lastPage}
          rowsPerPage={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      )}
    </>
  );
}
