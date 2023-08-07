import { StyledTableCell, TablePagination } from "@/components";
import { StudentItem } from "@/types/entities.type";
import { PaginatedResult } from "@/types/result.types";
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
  data: PaginatedResult<StudentItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  setDataStudent: (dataStudent: StudentItem) => void;
}
export function StudentsTable(props: Props): ReactElement {
  const {
    checked,
    handleCheck,
    handleState,
    data,
    setPage,
    limit,
    setLimit,
    setDataStudent,
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
                {t("commons.active")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((student: StudentItem, index: number) => (
              <TableRow
                key={student.user_id}
                selected={checked[index]}
                onClick={() => {
                  handleCheck(index);
                  setDataStudent(student);
                  handleState(student.state);
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
                  {student.name} {student.lastname}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {student.email}
                </StyledTableCell>
                <StyledTableCell align="center">{student.code}</StyledTableCell>
                <StyledTableCell align="center">
                  {student.state ? (
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
