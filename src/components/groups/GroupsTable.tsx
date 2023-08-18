import { StyledTableCell, TablePagination } from "@/components";
import { PaginatedResult, GroupItem } from "@/types";
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
  data: PaginatedResult<GroupItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  setGroup: (group: GroupItem) => void;
}
export function GroupsTable(props: Props): ReactElement {
  const {
    checked,
    handleCheck,
    handleState,
    data,
    setPage,
    limit,
    setLimit,
    setGroup,
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
                {t("groups.professorName")}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: "200px" }}>
                {t("user.name")}
              </StyledTableCell>
              <StyledTableCell align="center">
                {t("commons.active")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((group: GroupItem, index: number) => (
              <TableRow
                key={group.group_id}
                selected={checked[index]}
                onClick={() => {
                  handleCheck(index);
                  setGroup(group);
                  handleState(group.state);
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
                  {group.professor_user.name} {group.professor_user.lastname}
                </StyledTableCell>
                <StyledTableCell align="center">{group.name}</StyledTableCell>
                <StyledTableCell align="center">
                  {group.state ? (
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
