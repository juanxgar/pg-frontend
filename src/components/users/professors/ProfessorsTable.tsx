import { StyledTableCell, TablePagination } from "@/components";
import { ProfessorItem, PaginatedResult } from "@/types";
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
  data: PaginatedResult<ProfessorItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  setDataProfessor: (dataProfessor: ProfessorItem) => void;
}
export function ProfessorsTable(props: Props): ReactElement {
  const {
    checked,
    handleCheck,
    handleState,
    data,
    setPage,
    limit,
    setLimit,
    setDataProfessor,
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
                {t("user.fullName")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "200px" }}>
                {t("user.email")}
              </StyledTableCell>
              <StyledTableCell align="center">{t("user.code")}</StyledTableCell>
              <StyledTableCell align="center">
                {t("specialities.speciality")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("commons.active")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((professor: ProfessorItem, index: number) => (
              <TableRow
                key={professor.user_id}
                selected={checked[index]}
                onClick={() => {
                  handleCheck(index);
                  setDataProfessor(professor);
                  handleState(professor.state);
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
                  {professor.name} {professor.lastname}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {professor.email}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {professor.code}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {professor.professor_speciality &&
                    professor.professor_speciality[0].speciality.description}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {professor.state ? (
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
