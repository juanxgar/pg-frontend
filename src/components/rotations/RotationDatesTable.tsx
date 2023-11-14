import { StyledTableCell } from "@/components";
import {
  DatesRotationDatesResult,
  GroupDetailItem,
  RotationDatesStudents,
  StudentRotation,
  UserItem,
} from "@/types";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { ReactElement, useEffect } from "react";

interface Props {
  checked: Array<boolean>;
  handleCheck: (index: number) => void;
  dataDates?: Array<DatesRotationDatesResult>;
  dataStudents?: Array<StudentRotation>;
  setStudent: (student: StudentRotation) => void;
  student_user_id?: string;
}
export function RotationDatesTable(props: Props): ReactElement {
  const {
    dataDates,
    dataStudents,
    checked,
    handleCheck,
    setStudent,
    student_user_id,
  } = props;

  return (
    <>
      <TableContainer sx={{ marginTop: "10px" }}>
        <Table sx={{ minWidth: "700px", tableLayout: "fixed" }} stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell
                align="center"
                sx={{ width: "200px" }}
              ></StyledTableCell>
              <>
                {dataDates?.map((date: DatesRotationDatesResult) => (
                  <StyledTableCell
                    key={date.start_date}
                    align="center"
                    sx={{ width: "200px" }}
                  >
                    {date.start_date} {"→"} {date.finish_date}
                  </StyledTableCell>
                ))}
              </>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataStudents?.map((student: StudentRotation, index: number) => {
              if (
                student_user_id &&
                student.student_user_id === +student_user_id
              ) {
                return (
                  <TableRow
                    key={student.student_user_id}
                    selected={checked[index]}
                    onClick={() => {
                      handleCheck(index);
                      setStudent({
                        student_user_id: student.student_user_id,
                        name: student.name,
                        lastname: student.lastname,
                      });
                    }}
                  >
                    <StyledTableCell align="center">
                      {student.name} {student.lastname}
                    </StyledTableCell>
                    {student.rotation_dates?.map(
                      (date: RotationDatesStudents, i: number) => (
                        <StyledTableCell
                          key={`${date.rotation_date_id}_${i}`}
                          align="center"
                        >
                          {date.speciality?.description}
                        </StyledTableCell>
                      )
                    )}
                  </TableRow>
                );
              } else if (!student_user_id) {
                return (
                  <TableRow
                    key={student.student_user_id}
                    selected={checked[index]}
                    onClick={() => {
                      handleCheck(index);
                      setStudent({
                        student_user_id: student.student_user_id,
                        name: student.name,
                        lastname: student.lastname,
                      });
                    }}
                  >
                    <StyledTableCell align="center">
                      {student.name} {student.lastname}
                    </StyledTableCell>
                    {student.rotation_dates?.map(
                      (date: RotationDatesStudents, i: number) => (
                        <StyledTableCell
                          key={`${date.rotation_date_id}_${i}`}
                          align="center"
                        >
                          {date.speciality?.description}
                        </StyledTableCell>
                      )
                    )}
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
