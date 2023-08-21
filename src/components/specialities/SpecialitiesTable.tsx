import { StyledTableCell, TablePagination } from "@/components";
import { PaginatedResult, SpecialityItem } from "@/types";
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
  data: PaginatedResult<SpecialityItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  setSpeciality: (speciality: SpecialityItem) => void;
}
export function SpecialitiesTable(props: Props): ReactElement {
  const {
    checked,
    handleCheck,
    handleState,
    data,
    setPage,
    limit,
    setLimit,
    setSpeciality,
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
              <StyledTableCell align="center">
                {t("specialities.description")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("commons.active")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((speciality: SpecialityItem, index: number) => (
              <TableRow
                key={speciality.speciality_id}
                selected={checked[index]}
                onClick={() => {
                  handleCheck(index);
                  setSpeciality(speciality);
                  handleState(speciality.state);
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
                  {speciality.description}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {speciality.state ? (
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
