"use client";

import { Box, CssBaseline, Divider } from "@mui/material";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { lightTheme } from "@/themes";
import { Footer, Header, Navbar } from "@/components";
import { QueryClient, QueryClientProvider } from "react-query";
import { Locale } from "@/types";

interface Props {
  children?: ReactNode;
  params: Locale;
}

export function Layout(props: Props): ReactElement {
  const { children, params } = props;

  const pathname: string = usePathname();
  const queryClient = new QueryClient();

  const { status }: { status: string } = useSession<boolean>();

  const [open, setOpen] = useState<boolean>(true);
  const [showLayout, setShowLayout] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  const handleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      if (
        pathname != `/${params.locale}` &&
        pathname != `/${params.locale}/auth/recover-password` &&
        pathname != `/${params.locale}/auth/new-password`
      ) {
        setShowLayout(false);
        redirect(`/${props.params.locale}`);
      } else {
        setShowLayout(false);
      }
    }
    if (status === "authenticated") {
      setShowLayout(true);

      if (pathname === `/` || pathname === `/${params.locale}`) {
        redirect(`/${props.params.locale}/home`);
      }
    }
  }, [status]);

  return (
    <QueryClientProvider client={queryClient}>
      {showLayout ? (
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box
              component="nav"
              sx={{
                width: {
                  xs: "0px",
                  lg: open ? "256px" : "0px",
                },
                transition: "width 300ms ease",
              }}
            >
              <Navbar
                open={open}
                onClose={handleDrawer}
                locale={params.locale}
                setUserName={setUserName}
              />
            </Box>
            <Box
              sx={{
                width: {
                  xs: "0px",
                  lg: "256px",
                },
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
        children
      )}
    </QueryClientProvider>
  );
}
