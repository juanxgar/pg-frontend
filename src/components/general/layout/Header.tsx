import {
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Box,
  Menu,
  useMediaQuery,
  Avatar,
  MenuItem,
  Typography,
  Theme,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Close,
  ExitToApp,
  ExpandMore,
  Menu as MenuIcon,
  Person,
} from "@mui/icons-material";
import Image from "next/image";
import { Images } from "@/utils";
import { MouseEvent, ReactElement, useState } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import SnackbarComponent from "../SnackbarComponent";

interface Props {
  onDrawerToggle: () => void;
  open: boolean;
  locale: string;
  userName: string;
}
export default function Header(props: Props): ReactElement {
  const { onDrawerToggle, open, locale, userName } = props;
  const theme: Theme = useTheme();
  const xs: boolean = useMediaQuery(theme.breakpoints.up("xs"));
  const lg: boolean = useMediaQuery(theme.breakpoints.up("lg"));
  const t = useTranslations();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
  const isOpenMenu = Boolean(openMenu);

  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setOpenMenu(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const closeSession = () => {
    handleCloseMenu();
    handleOpenSnackbar();
    setTimeout(() => {
      signOut({ callbackUrl: `/${locale}` });
    }, 2000);
  };

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: "white",
        }}
        position="static"
        elevation={0}
        color="primary"
      >
        <SnackbarComponent
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
          severity={"info"}
          message={t("login.sessionClosed")}
        />
        <Toolbar>
          <Grid
            container
            spacing={0}
            alignItems="center"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={1}>
              {open ? (
                <IconButton
                  style={{ backgroundColor: "#048014", color: "#FFFFFF" }}
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  edge="start"
                >
                  <Close />
                </IconButton>
              ) : (
                <IconButton
                  style={{ backgroundColor: "#048014", color: "#FFFFFF" }}
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Grid>
            <Grid item xs={11}>
              <Grid container spacing={0}>
                <Grid item xs={11} lg={9}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        maxWidth: xs ? "150px" : "200px",
                        height: "40px",
                      }}
                      src={Images.logo}
                      alt="Logo UCEVA"
                    />
                  </Box>
                </Grid>
                <Grid item xs={1} lg={3}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: lg ? "flex-end" : "center",
                      alignItems: "center",
                    }}
                  >
                    {lg && (
                      <Typography
                        paddingTop={1}
                        paddingBottom={1}
                        fontWeight="bold"
                        fontSize="18px"
                        color="#048014"
                        marginRight={lg ? "15px" : "0px"}
                        textAlign="center"
                      >
                        {userName}
                      </Typography>
                    )}
                    <IconButton
                      aria-label="open drawer"
                      onClick={handleOpenMenu}
                      edge="start"
                    >
                      {lg && (
                        <Avatar
                          sx={{
                            bgcolor: "#048014",
                            marginRight: "10px",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <Person />
                        </Avatar>
                      )}
                      <ExpandMore sx={{ color: "#048014", fontSize: "40px" }} />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={openMenu}
                      open={isOpenMenu}
                      onClose={handleCloseMenu}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={closeSession}>
                        <ExitToApp sx={{ marginRight: "10px", color: "red" }} />
                        {t("login.logOut")}
                      </MenuItem>
                    </Menu>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
