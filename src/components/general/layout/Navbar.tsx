import { MenuOptions } from "@/types/common.type";
import {
  Images,
  MenuOptionsAdminEs,
  MenuOptionsProfessorEs,
  MenuOptionsStudentEs,
} from "@/utils";
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
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  locale: string;
  userName: string;
}

export function Navbar(props: Props): ReactElement {
  const { open, onClose, locale, userName } = props;

  const { data: session, status }: { data: Session | null; status: string } =
    useSession<boolean>();

  const actualPathname: string = usePathname();

  const router: AppRouterInstance = useRouter();

  const [menuOptions, setMenuOptions] = useState<Array<MenuOptions> | null>(
    null
  );
  const [openMenu, setOpenMenu] = useState<Array<boolean>>(
    Array(MenuOptionsAdminEs.length).fill(false)
  );

  useEffect(() => {
    if (locale === "es") {
      if (status === "authenticated") {
        if (session?.accessToken.role === "Administrador") {
          setOpenMenu(Array(MenuOptionsAdminEs.length).fill(false));
          setMenuOptions(MenuOptionsAdminEs);
        }
        if (session?.accessToken.role === "Estudiante") {
          setOpenMenu(Array(MenuOptionsStudentEs.length).fill(false));
          setMenuOptions(MenuOptionsStudentEs);
        }
        if (session?.accessToken.role === "Profesor") {
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
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <Image
            style={{
              maxWidth: "150px",
              height: "40px",
            }}
            src={Images.logo}
            alt="Logo UCEVA"
          />
        </Box>
        {!lg && (
          <Box
            sx={{
              direction: "column",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginBottom: "10px",
            }}
          >
            <Typography
              paddingTop={1}
              paddingBottom={1}
              fontWeight="bold"
              fontSize="18px"
              color="#048014"
            >
              {userName}
            </Typography>
          </Box>
        )}
        <List style={{ width: "256px" }}>
          {menuOptions?.map(({ name, icon, items, pathname }, i) => (
            <Box key={name}>
              <ListItemButton
                onClick={
                  items.length != 0
                    ? () => handleMenu(i)
                    : () => router.push(`/${locale}/${pathname}`)
                }
                selected={
                  actualPathname === `/${locale}${pathname}` ? true : false
                }
              >
                <ListItemIcon sx={{ color: "#048014" }}>{icon()}</ListItemIcon>
                <ListItemText sx={{ color: "black" }}>
                  <Typography>{name}</Typography>
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
                          selected={
                            actualPathname === `/${locale}${pathname}`
                              ? true
                              : false
                          }
                          onClick={() => router.push(`/${locale}/${pathname}`)}
                        >
                          <ListItemIcon sx={{ color: "#048014" }}>
                            {icon()}
                          </ListItemIcon>
                          <ListItemText sx={{ color: "black" }}>
                            <Typography>{name}</Typography>
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
