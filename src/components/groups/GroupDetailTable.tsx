import { StyledTableCell, TablePagination } from "@/components";
import { GroupDetailItem, GroupItem, PaginatedResult } from "@/types";
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
  data: PaginatedResult<GroupDetailItem> | undefined;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
}
export function GroupDetailTable(props: Props): ReactElement {
  const { data, setPage, limit, setLimit } = props;
  const t = useTranslations();

  return (
    <>
      <TableContainer sx={{ marginTop: "20px" }}>
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
            {data?.data.map((groupDetail: GroupDetailItem, index: number) => (
              <TableRow key={groupDetail.user.user_id}>
                <StyledTableCell
                  align="center"
                  sx={{ width: { lg: "100px", xs: "50px" } }}
                >
                  <Typography fontWeight="500">{index + 1}</Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {groupDetail.user.name} {groupDetail.user.lastname}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {groupDetail.user.email}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {groupDetail.user.code}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {groupDetail.user.state ? (
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
