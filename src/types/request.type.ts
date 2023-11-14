import { Moment } from "moment";

export type SignInRequest = {
  email?: string;
  password?: string;
};

export type RecoverPasswordRequest = {
  email: string;
};

export type NewPasswordRequest = {
  resetPasswordToken: string;
  password: string;
};

export type FormikNewPasswordRequest = {
  resetPasswordToken: string;
  password: string;
  password2: string;
};

export type UserFilterParams = {
  name?: string;
  code?: string;
  email?: string;
  state?: boolean;
  page?: number;
  limit?: number;
  speciality_id?: number;
};

export type UserCreationBody = {
  name: string;
  lastname: string;
  identification: number;
  role: string;
  code: string;
  email: string;
  password: string;
  speciality_id?: number;
};

export type SpecialityFilterParams = {
  description?: string;
  state?: boolean;
  page?: number;
  limit?: number;
};

export type UpdateUserRequest = {
  user_id: string;
  body: UserCreationBody;
};

export type GroupFilterParams = {
  name?: string;
  professor_user_id?: string;
  state?: boolean;
  page?: number;
  limit?: number;
  user_id?: string;
};

export type GroupsInRotationParams = {
  isCurrently?: boolean;
  student_user_id?: string;
};

export type GroupCreationBody = {
  name: string;
  professor_user_id: number;
  group_detail: Array<GroupDetailBody>;
};

export type GroupDetailBody = {
  user_id: number;
};

export type UpdateGroupRequest = {
  group_id: string;
  body: GroupCreationBody;
};

export type GroupDetailRequest = {
  group_id: number;
  params?: GroupDetailParams;
};

export type GroupDetailParams = {
  name?: string;
  page?: number;
  limit?: number;
};

export type SpecialityCreationBody = {
  description: string;
};

export type UpdateSpecialityRequest = {
  speciality_id: string;
  body: SpecialityCreationBody;
};

export type LocationFilterParams = {
  name?: string;
  adress?: string;
  city?: string;
  complexity?: string;
  state?: boolean;
  page?: number;
  limit?: number;
};

export type LocationBody = {
  name: string;
  adress: string;
  city: string;
  total_capacity: number;
  complexity: string;
};

export type LocationCreationBody = LocationBody & {
  specialities: Array<LocationDetailBody>;
};

export type LocationUpdateBody = LocationBody & {
  specialities: Array<LocationDetailUpdateBody>;
};

export type LocationDetailBody = {
  speciality_id: number;
  limit_capacity: number;
};

export type LocationDetailUpdateBody = LocationDetailBody & {
  location_speciality_id: number;
};

export type UpdateLocationRequest = {
  location_id: string;
  body: LocationUpdateBody;
};

export type LocationDetailRequest = {
  location_id: number;
  params?: LocationDetailParams;
};

export type LocationDetailParams = {
  description?: string;
  page?: number;
  limit?: number;
};

export type FormikRotationCreation = {
  group_id: number;
  location_id: number;
  start_date: Moment | null;
  finish_date: Moment | null;
  semester: number;
  specialities: Array<RotationSpecialityCreationBody>;
};

export type RotationBody = {
  group_id: number;
  location_id: number;
  start_date: string;
  finish_date: string;
  semester: number;
};

export type RotationCreationBody = RotationBody & {
  specialities: Array<RotationSpecialityCreationBody>;
};

export type RotationUpdateBody = RotationBody & {
  specialities: Array<RotationSpecialityUpdateBody>;
};

export type RotationSpecialityCreationBody = {
  speciality_id: number;
  professor_user_id: number;
  number_weeks: number;
};

export type RotationSpecialityUpdateBody = RotationSpecialityCreationBody & {
  rotation_speciality_id?: number;
};

export type RotationFilterParams = {
  group_id?: number;
  location_id?: number;
  start_date?: string;
  finish_date?: string;
  semester?: number;
  state?: boolean;
  page?: number;
  limit?: number;
  user_id?: number;
};

export type UpdateRotationRequest = {
  rotation_id: string;
  body: RotationUpdateBody;
};

export type RotationDateCreationBody = {
  rotation_id: number;
  student_user_id: number;
  rotation_dates: Array<RotationDateCreationDatesBody>;
};

export type RotationDateCreationDatesBody = {
  rotation_speciality_id: number;
  start_date: string;
  finish_date: string;
};

export type StudentRotationDatesParams = {
  rotationId: string;
  studentId: string;
};

export type FormikRotationDateCreation = {
  rotation_id: number;
  student_user_id: number;
  rotation_dates: Array<FormikRotationDateCreationDates>;
};

export type FormikRotationDateCreationDates = {
  rotation_speciality_id: number;
  start_date: Moment | null;
  finish_date: Moment | null;
};

export type FormikRotationDates = {
  start_date: Moment | null;
  finish_date: Moment | null;
};

export type EvaluationParams = {
  rotation_speciality_id: string;
  student_user_id: string;
};

export type FormikEvaluationSearch = {
  group_id: string;
  student_user_id: string;
  date: string;
  rotation_speciality_id: string;
};

export type FormikEvaluationCreation = {
  professor_comments?: string;
  student_comments?: string;
  student_grades?: Array<FormikStudentGrades>;
};

export type FormikStudentGrades = {
  subdescription_exam_id?: number;
  student_grade_id?: number;
  grade_value: number;
};

export type EvaluationBody = {
  professor_comments: string;
};

export type EvaluationCreationBody = EvaluationBody & {
  rotation_speciality_id: number;
  student_user_id: number;
  student_grades: Array<StudentGradeCreationBody>;
};

export type EvaluationUpdateBody = EvaluationBody & {
  student_comments: string;
  student_grades: Array<StudentGradeUpdateBody>;
};

export type StudentGradeBody = {
  grade_value: number;
};

export type StudentGradeCreationBody = StudentGradeBody & {
  subdescription_exam_id: number;
};

export type StudentGradeUpdateBody = StudentGradeBody & {
  student_grade_id: number;
};

export type UpdateEvaluationRequest = {
  evaluation_id: string;
  body: EvaluationUpdateBody;
};
