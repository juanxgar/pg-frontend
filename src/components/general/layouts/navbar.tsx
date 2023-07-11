"use client";

import { MenuOptions } from "@/types/common.type";
import { MenuOptionsAdminEs, MenuOptionsProfessorEs, MenuOptionsStudentEs } from "@/utils";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  open: any;
  onClose: any;
  locale: string;
}

export default function Navbar(props: Props) {
  const { open, onClose, locale } = props;

  const { data: session, status } = useSession();

  const router = useRouter();

  const [menuOptions, setMenuOptions] = useState<Array<MenuOptions> | null>(
    null
  );
  const [openMenu, setOpenMenu] = useState<Array<boolean>>(
    Array(MenuOptionsAdminEs.length).fill(false)
  );

  useEffect(() => {
    if (locale === "es") {
      if (status === "authenticated") {
        if (session.accessToken.role === "Administrador") {
          setOpenMenu(Array(MenuOptionsAdminEs.length).fill(false));
          setMenuOptions(MenuOptionsAdminEs);
        }
        if (session.accessToken.role === "Estudiante") {
          setOpenMenu(Array(MenuOptionsStudentEs.length).fill(false));
          setMenuOptions(MenuOptionsStudentEs);
        }
        if (session.accessToken.role === "Profesor") {
          setOpenMenu(Array(MenuOptionsProfessorEs.length).fill(false));
          setMenuOptions(MenuOptionsProfessorEs);
        }
      }
    }
  }, [status]);

  const handleMenu = (index: number) => {
    const menu = openMenu.map((e, i) => {
      if (i === index) {
        return !e;
      } else {
        return e;
      }
    });
    setOpenMenu(menu);
  };

  const theme = createTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        variant={lg ? "persistent" : "temporary"}
        style={{ width: "200px", minHeight: "98vh" }}
      >
        <List style={{ width: "256px" }}>
          <ListItem>
            <ListItemText sx={{ textAlign: "center" }}>
              <Typography
                paddingTop={1}
                paddingBottom={1}
                fontWeight="bold"
                fontSize="25px"
                fontFamily={"DejaVuSans, sans-serif"}
                color="#048014"
              >
                Nombre usuario
              </Typography>
            </ListItemText>
          </ListItem>
          {menuOptions?.map(({ name, icon, items, pathname }, i) => (
            <Box key={name}>
              <ListItemButton
                onClick={
                  items.length != 0
                    ? () => handleMenu(i)
                    : () => router.push(`/${locale}/${pathname}`)
                }
              >
                <ListItemIcon sx={{ color: "#048014" }}>{icon()}</ListItemIcon>
                <ListItemText sx={{ color: "black" }}>
                  <Typography fontFamily={"DejaVuSans, sans-serif"}>
                    {name}
                  </Typography>
                </ListItemText>

                {items.length != 0 && (
                  <>
                    {openMenu[i] ? (
                      <ExpandLess sx={{ color: "black" }} />
                    ) : (
                      <ExpandMore sx={{ color: "black" }} />
                    )}
                  </>
                )}
              </ListItemButton>
              <Collapse in={openMenu[i]} timeout="auto" unmountOnExit>
                <List
                  style={{ marginLeft: "10px" }}
                  component="div"
                  disablePadding
                >
                  {items.map(({ name, pathname, icon }) => (
                    <div key={name}>
                      <ListItem>
                        <ListItemButton
                          onClick={() => router.push(`/${locale}/${pathname}`)}
                        >
                          <ListItemIcon sx={{ color: "#048014" }}>
                            {icon()}
                          </ListItemIcon>
                          <ListItemText>
                            <Typography
                              fontFamily={"DejaVuSans, sans-serif"}
                              fontSize="14px"
                            >
                              {name}
                            </Typography>
                          </ListItemText>
                        </ListItemButton>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  );
}
