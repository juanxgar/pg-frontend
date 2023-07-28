import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import { checkboxClasses } from "@mui/material/Checkbox";

export const StyledCheckboxTableHeader = styled(Checkbox)(() => ({
  color: "white",
  [`&.${checkboxClasses.checked}`]: {
    color: "white",
  },
}));
