"use client";

import { Box, CssBaseline, Divider, useMediaQuery } from "@mui/material";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { lightTheme } from "@/themes";
import { Footer, Header, Navbar } from "@/components";
import { useUser } from "@/hooks/user.queries";
import { UserItem } from "@/types/entities.type";

interface Props {
  children?: ReactNode;
  params: { locale: string };
}

export function Layout(props: Props): ReactElement {
  const { children, params } = props;

  const { useLoggedUser } = useUser();

  const pathname: string = usePathname();

  const { status }: { status: string } = useSession<boolean>();

  const [open, setOpen] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [showLayout, setShowLayout] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  const xs: boolean = useMediaQuery(lightTheme.breakpoints.up("xs"));

  const {
    data,
    isLoading,
  }: {
    data: UserItem | undefined;
    isLoading: boolean;
    refetch: () => void;
  } = useLoggedUser();

  const handleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      if (pathname != `/${params.locale}`) {
        setShowLayout(false);
        redirect(`/${props.params.locale}`);
      } else {
        setShowLayout(false);
      }
    }
    if (status === "authenticated") {
      setShowLayout(true);
      if (pathname == `/${params.locale}`) {
        redirect(`/${props.params.locale}/home`);
      }
    }

    if (!isLoading) {
      setUserName(data ? data.name + " " + data.lastname : "");
    }
  }, [status, isLoading]);

  useEffect(() => {
    if (xs) {
      setShow(true);
    }
  }, [xs]);

  return (
    <>
      {show && showLayout ? (
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Box sx={{ display: "flex", minHeight: "98vh" }}>
            <Box
              component="nav"
              sx={{
                width: { xs: xs ? "0px" : "256px", lg: open ? "256px" : "0px" },
                transition: "width 300ms ease",
              }}
            >
              <Navbar
                open={open}
                onClose={handleDrawer}
                locale={params.locale}
                userName={userName}
              />
            </Box>
            <Box
              sx={{
                width: xs ? "0px" : "256px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Header
                open={open}
                onDrawerToggle={handleDrawer}
                locale={params.locale}
                userName={userName}
              />
              <Divider />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  py: 0,
                  px: 0,
                  bgcolor: "#ffffff",
                }}
              >
                {children}
              </Box>
              <Box component="footer" sx={{ p: 0, bgcolor: "#FFFFFF" }}>
                <Footer />
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      ) : (
        show && children
      )}
    </>
  );
}
