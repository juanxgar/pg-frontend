import { StyledTableCell, TablePagination } from "@/components";
import { PaginatedResult, RotationItem } from "@/types";
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
import moment from "moment";

interface Props {
  checked: Array<boolean>;
  handleCheck: (index: number) => void;
  data: PaginatedResult<RotationItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  setRotation: (rotation: RotationItem) => void;
}
export function RotationsTable(props: Props): ReactElement {
  const { checked, handleCheck, data, setPage, limit, setLimit, setRotation } =
    props;
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
              <StyledTableCell align="center" sx={{ width: "100px" }}>
                {t("rotations.semester")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "300px" }}>
                {t("locations.locationCapitalLetter")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "150px" }}>
                {t("rotations.startDate")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "150px" }}>
                {t("rotations.finishDate")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "200px" }}>
                {t("commons.professor")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((rotation: RotationItem, index: number) => (
              <TableRow
                key={rotation.rotation_id}
                selected={checked[index]}
                onClick={() => {
                  handleCheck(index);
                  setRotation(rotation);
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
                  {rotation.semester}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {rotation.location.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {moment(rotation.start_date).add(1, 'd').format("DD-MM-YYYY")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {moment(rotation.finish_date).add(1, 'd').format("DD-MM-YYYY")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {rotation.group.professor_user.name}{" "}
                  {rotation.group.professor_user.lastname}
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
