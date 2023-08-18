import {
  CancelButton,
  EditButton,
  InputComponent,
  ListComponent,
} from "@/components";
import { useGroup, useUser } from "@/hooks";
import { GroupCreationSchema } from "@/schemas";
import {
  GroupCreationBody,
  GroupDetailBody,
  GroupItem,
  ProfessorItem,
  StudentGroupItem,
  StudentItem,
  GroupDetailItem,
} from "@/types";
import { AlertColor, Box, Grid, MenuItem, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect, useState } from "react";
import { UpdateGroupRequest } from "../../types/request.type";

interface Props {
  toggleDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (openSnackbar: boolean) => void;
  refetch: () => void;
  dataProfessors?: Array<ProfessorItem>;
  group_id: number;
}

export function GroupUpdate(props: Props): ReactElement {
  const {
    toggleDrawer,
    refetch,
    setLoading,
    setMessageSnackbar,
    setSeveritySnackbar,
    setOpenSnackbar,
    dataProfessors,
    group_id,
  } = props;

  const { useUpdateGroup, useSpecificGroup } = useGroup();

  const { useAllStudents, errorStatus } = useUser();

  const t = useTranslations();

  const [studentsList, setStudentsList] = useState<Array<StudentGroupItem>>([]);

  const {
    data: dataGroup,
    isLoading: isLoadingGroup,
    isSuccess: isSuccessGroup,
  }: {
    data?: GroupItem;
    isLoading: boolean;
    isSuccess: boolean;
  } = useSpecificGroup(group_id.toString());

  const [initialValues, setInitialValues] = useState<GroupCreationBody>({
    name: "",
    professor_user_id: 0,
    group_detail: [],
  });

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: initialValues,
    validationSchema: GroupCreationSchema(t),
    onSubmit: (values) => {
      updateGroup(values);
    },
  });

  const updateGroup = (values: GroupCreationBody) => {
    const request: UpdateGroupRequest = {
      group_id,
      body: values,
    };
    mutate(request);
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
    data: dataUpdate,
    isLoading: isLoadingUpdate,
    isError,
    error,
  } = useUpdateGroup();

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
      setMessageSnackbar(t("groups.studentAddedToList"));
      setSeveritySnackbar("warning");
      setOpenSnackbar(true);
    }
  };

  const deleteStudentFromList = (user_id: number) => {
    const studentsListAux = studentsList.filter(
      (student: StudentGroupItem) => student.user_id != user_id
    );
    formik.setFieldValue("group_detail", studentsListAux);
    setStudentsList((old) => old.filter((e) => e.user_id != user_id));
  };

  useEffect(() => {
    if (isSuccessGroup && dataGroup) {
      let group_detail: Array<GroupDetailBody> = [];
      let studentGroupItems: Array<StudentGroupItem> = [];
      if (dataGroup.group_detail) {
        studentGroupItems = dataGroup.group_detail.map((e: GroupDetailItem) => {
          return {
            user_id: e.user.user_id,
            code: e.user.code,
            name: e.user.name + " " + e.user.lastname,
          };
        });
        group_detail = dataGroup.group_detail.map((e: GroupDetailItem) => {
          return { user_id: e.user.user_id };
        });
      }

      const groupUpdate: GroupCreationBody = {
        group_detail,
        name: dataGroup.name,
        professor_user_id: dataGroup.professor_user.user_id,
      };
      setInitialValues(groupUpdate);
      setStudentsList(studentGroupItems);
    }
  }, [isSuccessGroup, dataGroup]);

  useEffect(() => {
    if (!isLoadingStudents || !isLoadingGroup) {
      setLoading(false);
    }
  }, [isLoadingStudents, isLoadingGroup]);

  useEffect(() => {
    if (isSuccess) {
      toggleDrawer();
      setMessageSnackbar(dataUpdate.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetch();
    }
  }, [isLoadingUpdate]);

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
            <EditButton />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
