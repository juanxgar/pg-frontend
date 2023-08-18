import {
  CancelButton,
  CreateButton,
  InputComponent,
  ListComponent,
} from "@/components";
import { useGroup, useUser } from "@/hooks";
import { GroupCreationSchema } from "@/schemas";
import {
  GroupCreationBody,
  ProfessorItem,
  StudentGroupItem,
  StudentItem,
} from "@/types";
import { AlertColor, Box, Grid, MenuItem, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect, useState } from "react";

interface Props {
  toggleDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (openSnackbar: boolean) => void;
  refetch: () => void;
  checked: Array<boolean>;
  setChecked: (cheked: Array<boolean>) => void;
  dataProfessors?: Array<ProfessorItem>;
}

export function GroupCreation(props: Props): ReactElement {
  const {
    toggleDrawer,
    refetch,
    setLoading,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    checked,
    setChecked,
    dataProfessors,
  } = props;

  const { useCreateGroup } = useGroup();

  const { useAllStudents, errorStatus } = useUser();

  const t = useTranslations();

  const [studentsList, setStudentsList] = useState<Array<StudentGroupItem>>([]);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      name: "",
      professor_user_id: 0,
      group_detail: [],
    },
    validationSchema: GroupCreationSchema(t),
    onSubmit: (values) => {
      createGroup(values);
    },
  });

  const createGroup = (values: GroupCreationBody) => {
    mutate(values);
  };

  const {
    data: dataStudents,
    isLoading: isLoadingStudents,
  }: {
    data: Array<StudentItem> | undefined;
    isLoading: boolean;
  } = useAllStudents({
    state: true,
  });

  const {
    mutate,
    isSuccess,
    data: dataCreation,
    isLoading: isLoadingCreation,
    isError,
    error,
  } = useCreateGroup();

  const addStudentToList = (
    user_id: number,
    name: string,
    lastname: string,
    code: string
  ) => {
    const user: StudentGroupItem = {
      user_id,
      name: name + " " + lastname,
      code,
    };

    if (!studentsList.some((e) => e.user_id === user.user_id)) {
      setStudentsList((old) => [...old, user]);
      const studentsListAux = studentsList.map((student: StudentGroupItem) => {
        return { user_id: student.user_id };
      });
      studentsListAux.push({ user_id });
      formik.setFieldValue("group_detail", studentsListAux);
    } else {
      console.log("el usuario ya está en la lista");
    }
  };

  const deleteStudentFromList = (user_id: number) => {
    setStudentsList((old) => old.filter((e) => e.user_id != user_id));
  };

  useEffect(() => {
    if (!isLoadingStudents) {
      setLoading(false);
    }
  }, [isLoadingStudents]);

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataCreation.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
      checked.push(false);
      setChecked(checked);
    }
  }, [isLoadingCreation]);

  useEffect(() => {
    if (isError) {
      if (error.status === 400) {
        setMessageSnackbar(error.data.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
  }, [isError]);

  useEffect(() => {
    if (errorStatus === 401) {
      setMessageSnackbar(t("commons.sessionExpired"));
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
  }, [errorStatus]);

  return (
    <Box sx={{ width: { xs: "325px", lg: "600px" } }}>
      <Typography
        sx={{
          textAlign: "left",
          fontSize: "20px",
          marginLeft: "20px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        {t("commons.creationForm")}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="name"
              name="name"
              label={t("user.name")}
              value={formik.values.name || ""}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="professor_user_id"
              name="professor_user_id"
              select
              label={t("commons.professor")}
              value={formik.values.professor_user_id || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.professor_user_id &&
                Boolean(formik.errors.professor_user_id)
              }
              helperText={
                formik.touched.professor_user_id &&
                formik.errors.professor_user_id
              }
            >
              {dataProfessors ? (
                dataProfessors?.map((professor: ProfessorItem) => (
                  <MenuItem key={professor.user_id} value={professor.user_id}>
                    {professor.name} {professor.lastname}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={6} xs={12}>
            <InputComponent
              type="text"
              id="student_user_id"
              name="student_user_id"
              select
              value={""}
              label={t("commons.students")}
            >
              {dataStudents ? (
                dataStudents.map((student: StudentItem) => (
                  <MenuItem
                    key={student.user_id}
                    value={student.user_id}
                    onClick={() =>
                      addStudentToList(
                        student.user_id,
                        student.name,
                        student.lastname,
                        student.code
                      )
                    }
                  >
                    {student.name} {student.lastname}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </InputComponent>
          </Grid>
          <Grid item lg={12} xs={12}>
            {studentsList.length > 0 && (
              <ListComponent
                students={studentsList}
                deleteStudentFromList={deleteStudentFromList}
              />
            )}
          </Grid>
          <Grid
            item
            lg={12}
            xs={12}
            sx={{
              direction: "column",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              display: "flex",
              marginTop: "10px",
              marginRight: "20px",
            }}
          >
            <CancelButton onClick={toggleDrawer} />
            <CreateButton />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
