import { StyledTableCell, TablePagination } from "@/components";
import {
  LocationDetailItem,
  PaginatedResult,
} from "@/types";
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
  data: PaginatedResult<LocationDetailItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
}
export function LocationDetailTable(props: Props): ReactElement {
  const { data, setPage, limit, setLimit } = props;
  const t = useTranslations();

  return (
    <>
      <TableContainer sx={{ marginTop: "20px" }}>
        <Table sx={{ minWidth: {lg: "700px", xs: "320px"}, tableLayout: "fixed" }} stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell
                align="center"
                sx={{ width: { lg: "100px", xs: "50px" } }}
              >
                {t("commons.number")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("specialities.description")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map(
              (locationDetail: LocationDetailItem, index: number) => (
                <TableRow key={locationDetail.location_speciality_id}>
                  <StyledTableCell
                    align="center"
                    sx={{ width: { lg: "100px", xs: "50px" } }}
                  >
                    <Typography fontWeight="500">{index + 1}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {locationDetail.speciality.description}
                  </StyledTableCell>
                </TableRow>
              )
            )}
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
