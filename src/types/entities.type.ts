export type UserItem = {
  user_id: number;
  name: string;
  lastname: string;
  identification: number;
  role: string;
  code: string;
  email: string;
  state: boolean;
  reset_password_token?: string;
};

export type StudentItem = UserItem;

export type ProfessorItem = UserItem & {
  professor_speciality: Array<{ speciality: SpecialityItem }>;
};

export type SpecialityItem = {
  speciality_id: number;
  description: string;
  state: boolean;
};

export type GroupItem = {
  group_id: number;
  name: string;
  state: boolean;
  professor_user: ProfessorItem;
  group_detail?: Array<GroupDetailItem>;
};

export type GroupDetailItem = {
  group_detail_id: number;
  user: UserItem;
};
