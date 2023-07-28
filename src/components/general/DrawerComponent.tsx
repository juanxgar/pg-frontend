import Drawer from "@mui/material/Drawer";
import { ReactElement } from "react";
import { Box, IconButton, styled, Toolbar, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LinearProgressComponent from "./LinearProgressComponent";

interface Props {
  open: boolean;
  toggleDrawer: () => void;
  children: ReactElement;
  title: string;
  isLoading: boolean;
}

const styleCloseButton = {
  backgroundColor: "#3CA249",
  position: "absolute",
  zIndex: 2,
  left: "-40px",
  top: "20px",
  width: "48px",
  padding: "8px",
  display: "flex",
  justifyContent: "center",
  boxShadow: "0px 2.36162px 0.787207px rgba(0, 0, 0, 0.25)",
  borderRadius: "12.5953px 0px 0px 12.5953px",
};

export default function DrawerComponent(props: Props): ReactElement {
  const { toggleDrawer, open, children, title, isLoading } = props;

  return (
    <DrawerStyled
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{ backdropFilter: "blur(12.5px)" }}
    >
      <Box sx={styleCloseButton}>
        <IconButton
          onClick={toggleDrawer}
          size="large"
          aria-label="open drawer"
          edge="start"
          sx={{ m: 0, p: 0, color: "white" }}
        >
          <HighlightOffIcon />
        </IconButton>
      </Box>
      <Toolbar
        sx={{
          backgroundColor: "#048014",
          borderRadius: "10px 0px 0px 0px",
          height: "80px",
          direction: "column",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: { xs: "20px", sm: "20px", md: "32px" },
            fontWeight: "700",
            color: "white",
          }}
          noWrap
          component="div"
        >
          {title}
        </Typography>
      </Toolbar>
      {isLoading && <LinearProgressComponent />}
      {children}
    </DrawerStyled>
  );
}

const DrawerStyled = styled(Drawer)(() => ({
  "& .MuiDrawer-paper": {
    borderRadius: "16px 0px 0px 16px",
    overflowY: "visible",
  },
  "& .MuiModal-backdrop": {
    backgroundColor: "rgba(217, 217, 217, 0.6)",
  },
}));
