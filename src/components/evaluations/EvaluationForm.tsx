import { useQuestion } from "@/hooks/question.queries";
import {
  DescriptionExamItem,
  EvaluationCreatedResult,
  EvaluationCreationBody,
  FormikStudentGrades,
  GroupInRotation,
  StudentGrade,
  StudentGradeCreationBody,
  StudentGradeUpdateBody,
  SubdescriptionExamItem,
  UpdateEvaluationRequest,
} from "@/types";
import { AlertColor, Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import { ReactElement, useEffect, useState } from "react";
import { InputComponent } from "../general/InputComponent";
import { useTranslations } from "next-intl";
import { GradesTable } from "./GradesTable";
import { useEvaluation } from "@/hooks";
import { SaveButton } from "../general/SaveButton";

interface Props {
  locale: string;
  groupInRotation?: GroupInRotation;
  positionGroupDetail: number;
  positionRotation: number;
  positionSpeciality: number;
  dataEvaluation?: EvaluationCreatedResult;
  isLoadingEvaluation: boolean;
  isErrorEvaluation: boolean;
  setMessageSnackbar: (message: string) => void;
  setSeveritySnackbar: (severity: AlertColor) => void;
  setOpenSnackbar: (value: boolean) => void;
  refetchEvaluation: () => void;
  isStudent?: boolean;
}

export function EvaluationForm(props: Props): ReactElement {
  const {
    locale,
    positionGroupDetail,
    positionRotation,
    groupInRotation,
    positionSpeciality,
    dataEvaluation,
    isLoadingEvaluation,
    isErrorEvaluation,
    setMessageSnackbar,
    setOpenSnackbar,
    setSeveritySnackbar,
    refetchEvaluation,
    isStudent,
  } = props;

  const t = useTranslations();

  const { useQuestions } = useQuestion();

  const { useCreateEvaluation, useUpdateEvaluation } = useEvaluation();

  const [professorComments, setProfessorComments] = useState<string>("");
  const [studentComments, setStudentComments] = useState<string>("");
  const [studentCommentsDisabled, setStudentCommentsDisabled] =
    useState<boolean>(true);

  const [arrayGrades, setArrayGrades] = useState<Array<FormikStudentGrades>>(
    []
  );

  const {
    data: dataQuestions,
    isLoading: isLoadingQuestions,
  }: {
    data: Array<DescriptionExamItem> | undefined;
    isLoading: boolean;
  } = useQuestions();

  const {
    mutate,
    isSuccess,
    data: dataCreation,
    isLoading: isLoadingCreation,
    isError,
    error,
  } = useCreateEvaluation();

  const {
    mutate: mutateUpdate,
    isSuccess: isSuccessUpdate,
    data: dataUpdate,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useUpdateEvaluation();

  const filterGrade = (subdescription_exam_id: number) => {
    const filter = dataEvaluation?.student_grade?.filter(
      (grade: StudentGrade) => {
        return grade.subdescription_exam_id === subdescription_exam_id;
      }
    );
    if (filter === undefined || filter.length === 0) {
      return "";
    } else {
      return filter[0].grade_value as unknown as string;
    }
  };

  const getPositionOfGrades = (subdescription_exam_id: number) => {
    return arrayGrades
      .map((grade: FormikStudentGrades) => grade.subdescription_exam_id)
      .indexOf(subdescription_exam_id);
  };

  const createArrayOfGrades = () => {
    if (!isLoadingQuestions && dataQuestions) {
      let index: number | undefined;
      const data: Array<FormikStudentGrades> = [];
      if (dataEvaluation && dataEvaluation.student_grade) {
        if (dataEvaluation.student_grade.length > 0) {
          dataQuestions.forEach((question: DescriptionExamItem) => {
            question.subdescription_exam.forEach(
              (subquestion: SubdescriptionExamItem) => {
                index = dataEvaluation.student_grade
                  ?.map((grade: StudentGrade) => grade.subdescription_exam_id)
                  .indexOf(subquestion.subdescription_exam_id);
                if (index != -1) {
                  data.push({
                    subdescription_exam_id:
                      dataEvaluation.student_grade[index]
                        .subdescription_exam_id,
                    student_grade_id:
                      dataEvaluation.student_grade[index].student_grade_id,
                    grade_value:
                      dataEvaluation.student_grade[index].grade_value,
                  });
                }
              }
            );
          });
        }
      } else {
        dataQuestions.forEach((question: DescriptionExamItem) => {
          question.subdescription_exam.forEach(
            (subquestion: SubdescriptionExamItem) => {
              data.push({
                subdescription_exam_id: subquestion.subdescription_exam_id,
                grade_value: 0.0,
              });
            }
          );
        });
      }
      setArrayGrades(data);
    }
  };

  const updateArrayGrades = (value: number, index: number) => {
    const updatedArray = [...arrayGrades];
    const element = updatedArray[index];
    const { grade_value, ...rest } = element;
    updatedArray[index] = { grade_value: value, ...rest };
    setArrayGrades(updatedArray);
  };

  const createOrUpdateEvaluation = () => {
    let numberStudentGradesId: number = 0;
    arrayGrades.forEach((grade: FormikStudentGrades) => {
      if (grade.student_grade_id) {
        numberStudentGradesId = numberStudentGradesId + 1;
      }
    });
    if (groupInRotation) {
      if (!dataEvaluation) {
        if (!isStudent) {
          const student_grades: Array<StudentGradeCreationBody> =
            arrayGrades.map((grade: FormikStudentGrades) => {
              return {
                subdescription_exam_id: grade.subdescription_exam_id || 0,
                grade_value: grade.grade_value,
              };
            });
          const body: EvaluationCreationBody = {
            professor_comments: professorComments,
            rotation_speciality_id:
              groupInRotation.rotation[positionRotation].rotation_speciality[
                positionSpeciality
              ].rotation_speciality_id,
            student_user_id:
              groupInRotation.group_detail[positionGroupDetail].user.user_id,
            student_grades,
          };

          mutate(body);
        } else {
          setMessageSnackbar("La evaluación aún no ha sido creada");
          setSeveritySnackbar("warning");
          setOpenSnackbar(true);
        }
      } else {
        const student_grades: Array<StudentGradeUpdateBody> = arrayGrades.map(
          (grade: FormikStudentGrades) => {
            return {
              student_grade_id: grade.student_grade_id || 0,
              grade_value: grade.grade_value,
            };
          }
        );
        const request: UpdateEvaluationRequest = {
          evaluation_id: dataEvaluation.evaluation_id as unknown as string,
          body: {
            professor_comments: professorComments,
            student_comments: studentComments,
            student_grades,
          },
        };

        mutateUpdate(request);
      }
    }
  };

  const setComments = () => {
    if (dataEvaluation && !isLoadingEvaluation) {
      setProfessorComments(dataEvaluation.professor_comments || "");
      setStudentComments(dataEvaluation.student_comments || "");
    }
    if (isErrorEvaluation) {
      setProfessorComments("");
      setStudentComments("");
    }
  };

  useEffect(() => {
    createArrayOfGrades();
    setComments();

    if (isErrorEvaluation) {
      setStudentCommentsDisabled(true);
    } else {
      setStudentCommentsDisabled(false);
    }

    if (
      moment().isBetween(
        moment(groupInRotation?.rotation[positionRotation].start_date).add(
          1,
          "days"
        ),
        moment(groupInRotation?.rotation[positionRotation].finish_date).add(
          1,
          "days"
        )
      )
    ) {
      setStudentCommentsDisabled(false);
    } else {
      setStudentCommentsDisabled(true);
    }
  }, [
    dataEvaluation,
    isLoadingEvaluation,
    isErrorEvaluation,
    isLoadingQuestions,
    dataQuestions,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setMessageSnackbar(dataCreation.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetchEvaluation();
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
    if (isSuccessUpdate) {
      setMessageSnackbar(dataUpdate.message);
      setSeveritySnackbar("success");
      setOpenSnackbar(true);
      refetchEvaluation();
    }
  }, [isLoadingUpdate]);

  useEffect(() => {
    if (isErrorUpdate) {
      if (errorUpdate.status === 400) {
        setMessageSnackbar(errorUpdate.data.message);
        setSeveritySnackbar("warning");
        setOpenSnackbar(true);
      }
    }
  }, [isErrorUpdate]);

  return (
    <Grid container marginTop="30px">
      <Grid item lg={12} xs={12}>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6" fontWeight="20px">
            FORMATO DE EVALUACIÓN DE PRÁCTICA
          </Typography>
        </Box>
      </Grid>
      <Grid item lg={10} xs={12}>
        <Grid container>
          <Grid item lg={6} xs={12} marginTop="10px">
            <Typography variant="body1">
              <strong>NOMBRE DOCENTE:</strong>{" "}
              {groupInRotation?.professor_user.name}{" "}
              {groupInRotation?.professor_user.lastname}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} marginTop="10px">
            <Typography variant="body1">
              <strong>NOMBRE ESTUDIANTE:</strong>{" "}
              {groupInRotation?.group_detail[positionGroupDetail].user.name}{" "}
              {groupInRotation?.group_detail[positionGroupDetail].user.lastname}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} marginTop="10px">
            <Typography variant="body1">
              <strong>ÁREA DE ROTACIÓN:</strong>{" "}
              {
                groupInRotation?.rotation[positionRotation].rotation_speciality[
                  positionSpeciality
                ].speciality.description
              }
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} marginTop="10px">
            <Typography variant="body1">
              <strong>INSTITUCIÓN:</strong>{" "}
              {groupInRotation?.rotation[positionRotation].location.name}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} marginTop="10px">
            <Typography variant="body1">
              <strong>FECHA INICIO:</strong>{" "}
              {moment(groupInRotation?.rotation[positionRotation].start_date)
                .add(1, "days")
                .format("DD-MM-YYYY")}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} marginTop="10px" marginBottom="20px">
            <Typography variant="body1">
              <strong>FECHA FIN:</strong>{" "}
              {moment(groupInRotation?.rotation[positionRotation].finish_date)
                .add(1, "days")
                .format("DD-MM-YYYY")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={2} xs={12}>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography variant="h6">
            <strong>Nota final</strong>
          </Typography>
          <br />
        </Box>
        <Box
          sx={{
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography variant="h6">
            <strong>
              {dataEvaluation && dataEvaluation.grade_value
                ? dataEvaluation.grade_value
                : ""}
            </strong>
          </Typography>
        </Box>
      </Grid>
      {dataQuestions?.map((question: DescriptionExamItem, i: number) => (
        <Grid
          item
          lg={12}
          xs={12}
          marginTop="30px"
          key={question.description_exam_id}
        >
          <Grid container>
            <Grid item lg={10} xs={10}>
              <Typography variant="body1">
                <strong>
                  {i + 1}. {question.description}
                </strong>
              </Typography>
            </Grid>
            <Grid item lg={2} xs={2}>
              <Box
                sx={{
                  direction: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography variant="body1">
                  <strong>Nota</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={12} xs={12}>
              {question.subdescription_exam.map(
                (subquestion: SubdescriptionExamItem, j: number) => (
                  <Grid container key={subquestion.subdescription_exam_id}>
                    <Grid item lg={10} xs={10} marginTop="10px">
                      <Typography fontSize="15px" variant="body1">
                        {i != 1 && `${i + 1}.${j + 1}.`}{" "}
                        {subquestion.subdescription}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      lg={2}
                      xs={2}
                      key={subquestion.subdescription_exam_id}
                    >
                      <InputComponent
                        disabled={isStudent}
                        type="number"
                        id={`student_grade_${getPositionOfGrades(
                          subquestion.subdescription_exam_id
                        )}`}
                        name={`student_grade_${getPositionOfGrades(
                          subquestion.subdescription_exam_id
                        )}`}
                        value={
                          (arrayGrades &&
                            arrayGrades[
                              getPositionOfGrades(
                                subquestion.subdescription_exam_id
                              )
                            ] &&
                            arrayGrades[
                              getPositionOfGrades(
                                subquestion.subdescription_exam_id
                              )
                            ].grade_value) ||
                          ""
                        }
                        onChange={(e) =>
                          updateArrayGrades(
                            +e.target.value,
                            getPositionOfGrades(
                              subquestion.subdescription_exam_id
                            )
                          )
                        }
                        inputProps={{ maxLength: 2, step: ".1" }}
                      />
                    </Grid>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid item lg={5} xs={12}>
        <GradesTable />
      </Grid>
      <Grid item lg={7} xs={12}>
        <InputComponent
          disabled={isStudent}
          type="text"
          id="professor_comments"
          name="comments_professor"
          label={t("evaluations.commentsProfessor")}
          multiline
          rows={4}
          value={professorComments}
          onChange={(e) => setProfessorComments(e.target.value)}
        />
        <InputComponent
          type="text"
          id="student_comments"
          name="student_comments"
          label={t("evaluations.commentsStudent")}
          multiline
          rows={4}
          value={studentComments}
          onChange={(e) => setStudentComments(e.target.value)}
          disabled={!isStudent ? true : studentCommentsDisabled}
        />
      </Grid>
      <Grid item lg={12} xs={12}>
        <SaveButton onClick={() => createOrUpdateEvaluation()} />
      </Grid>
    </Grid>
  );
}
