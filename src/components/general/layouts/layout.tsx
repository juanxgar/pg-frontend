"use client";

import { Box, Divider, useMediaQuery } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { lightTheme } from "@/themes";
import Navbar from "./navbar";
import Header from "./header";
import Footer from "../Footer";

interface Props {
  children?: ReactNode;
  params: { locale: string };
}

export default function Layout(props: Props) {
  const { children, params } = props;
  const pathname = usePathname();
  const { status } = useSession();
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);
  const [showLayout, setShowLayout] = useState(false);
  const xs = useMediaQuery(lightTheme.breakpoints.up("xs"));

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
  }, [status]);

  useEffect(() => {
    if (xs) {
      setShow(true);
    }
  }, [xs]);

  return (
    <>
      {show && showLayout ? (
        <ThemeProvider theme={lightTheme}>
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
    </>
  );
}
