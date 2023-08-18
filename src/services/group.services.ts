import { Http } from "@/libs";
import {
  ErrorResult,
  GroupCreationBody,
  GroupDetailRequest,
  GroupFilterParams,
  GroupItem,
  MessageResult,
  PaginatedResult,
  UpdateGroupRequest,
} from "@/types";

class GroupsServices {
  private http;
  constructor() {
    this.http = new Http().getInstance();
  }

  getAllGroupsWithPagination(
    params: GroupFilterParams
  ): Promise<PaginatedResult<GroupItem> | ErrorResult> {
    return this.http.get(`/groups/pagination`, {
      params,
    });
  }

  getSpecificGroup(group_id: string): Promise<GroupItem | ErrorResult> {
    return this.http.get(`/groups/unique/${group_id}`);
  }

  getGroupDetailWithPagination(
    request: GroupDetailRequest
  ): Promise<PaginatedResult<GroupItem> | ErrorResult> {
    return this.http.get(`/groups/detail/pagination/${request.group_id}`, {
      params: request.params,
    });
  }

  createGroup(
    body: GroupCreationBody | unknown
  ): Promise<MessageResult | ErrorResult> {
    return this.http.post(`/groups`, body);
  }

  updateGroup(
    request: UpdateGroupRequest
  ): Promise<MessageResult | ErrorResult> {
    return this.http.put(`/groups/${request.group_id}`, request.body);
  }

  updateStateGroup(group_id: string): Promise<MessageResult | ErrorResult> {
    return this.http.patch(`/groups/${group_id}`);
  }

  deleteGroup(group_id: string): Promise<MessageResult | ErrorResult> {
    return this.http.delete(`/groups/${group_id}`);
  }
}

export const GroupService = new GroupsServices();
