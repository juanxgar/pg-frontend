import { Table, TableBody, TableContainer, TableRow } from "@mui/material";
import { ReactElement } from "react";
import { StyledTableCell } from "../general/StyledTableCell";
import { useTranslations } from "next-intl";
import { grades } from "@/utils/gradesStudents";
import { GradesColumn } from "@/types";

export function GradesTable(): ReactElement {
  const t = useTranslations();

  return (
    <TableContainer sx={{ marginTop: "2px" }}>
      <Table
        sx={{ tableLayout: "fixed", border: "1px solid black" }}
        size="small"
      >
        <TableBody>
          {grades.map((e: GradesColumn) => (
            <TableRow key={e.id}>
              <StyledTableCell align="center">
                {t(`commons.${e.description}`)}
              </StyledTableCell>
              <StyledTableCell align="center">{e.value}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
