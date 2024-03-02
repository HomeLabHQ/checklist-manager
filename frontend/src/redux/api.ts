import { baseApi as api } from './baseApi';
export const addTagTypes = ['auth', 'checklist'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      authCreate: build.mutation<AuthCreateApiResponse, AuthCreateApiArg>({
        query: (queryArg) => ({
          url: `/api/auth/`,
          method: 'POST',
          body: queryArg.customTokenObtainPairRequest,
        }),
        invalidatesTags: ['auth'],
      }),
      authProfileRetrieve: build.query<AuthProfileRetrieveApiResponse, AuthProfileRetrieveApiArg>({
        query: () => ({ url: `/api/auth/profile/` }),
        providesTags: ['auth'],
      }),
      authRefreshCreate: build.mutation<AuthRefreshCreateApiResponse, AuthRefreshCreateApiArg>({
        query: (queryArg) => ({
          url: `/api/auth/refresh/`,
          method: 'POST',
          body: queryArg.tokenRefreshRequest,
        }),
        invalidatesTags: ['auth'],
      }),
      authRegisterCreate: build.mutation<AuthRegisterCreateApiResponse, AuthRegisterCreateApiArg>({
        query: (queryArg) => ({
          url: `/api/auth/register/`,
          method: 'POST',
          body: queryArg.signUpRequest,
        }),
        invalidatesTags: ['auth'],
      }),
      authVerifyCreate: build.mutation<AuthVerifyCreateApiResponse, AuthVerifyCreateApiArg>({
        query: (queryArg) => ({
          url: `/api/auth/verify/`,
          method: 'POST',
          body: queryArg.tokenVerifyRequest,
        }),
        invalidatesTags: ['auth'],
      }),
      checklistChecklistList: build.query<
        ChecklistChecklistListApiResponse,
        ChecklistChecklistListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist/`,
          params: { page: queryArg.page, page_size: queryArg.pageSize, project: queryArg.project },
        }),
        providesTags: ['checklist'],
      }),
      checklistChecklistCreate: build.mutation<
        ChecklistChecklistCreateApiResponse,
        ChecklistChecklistCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist/`,
          method: 'POST',
          body: queryArg.checkListRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistRunList: build.query<
        ChecklistChecklistRunListApiResponse,
        ChecklistChecklistRunListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run/`,
          params: { page: queryArg.page, page_size: queryArg.pageSize, project: queryArg.project },
        }),
        providesTags: ['checklist'],
      }),
      checklistChecklistRunItemCommentsCreate: build.mutation<
        ChecklistChecklistRunItemCommentsCreateApiResponse,
        ChecklistChecklistRunItemCommentsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run-item-comments/`,
          method: 'POST',
          body: queryArg.checkListRunSectionItemCommentRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistRunItemsUpdate: build.mutation<
        ChecklistChecklistRunItemsUpdateApiResponse,
        ChecklistChecklistRunItemsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run-items/${queryArg.id}/`,
          method: 'PUT',
          body: queryArg.checkListRunSectionItemRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistRunItemsPartialUpdate: build.mutation<
        ChecklistChecklistRunItemsPartialUpdateApiResponse,
        ChecklistChecklistRunItemsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run-items/${queryArg.id}/`,
          method: 'PATCH',
          body: queryArg.patchedCheckListRunSectionItemRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistRunRetrieve: build.query<
        ChecklistChecklistRunRetrieveApiResponse,
        ChecklistChecklistRunRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/checklist/checklist-run/${queryArg.id}/` }),
        providesTags: ['checklist'],
      }),
      checklistChecklistRunUpdate: build.mutation<
        ChecklistChecklistRunUpdateApiResponse,
        ChecklistChecklistRunUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run/${queryArg.id}/`,
          method: 'PUT',
          body: queryArg.checkListRunRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistRunPartialUpdate: build.mutation<
        ChecklistChecklistRunPartialUpdateApiResponse,
        ChecklistChecklistRunPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run/${queryArg.id}/`,
          method: 'PATCH',
          body: queryArg.patchedCheckListRunRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistRunStatisticRetrieve: build.query<
        ChecklistChecklistRunStatisticRetrieveApiResponse,
        ChecklistChecklistRunStatisticRetrieveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist-run/statistic/`,
          params: { project: queryArg.project },
        }),
        providesTags: ['checklist'],
      }),
      checklistChecklistRetrieve: build.query<
        ChecklistChecklistRetrieveApiResponse,
        ChecklistChecklistRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/checklist/checklist/${queryArg.id}/` }),
        providesTags: ['checklist'],
      }),
      checklistChecklistUpdate: build.mutation<
        ChecklistChecklistUpdateApiResponse,
        ChecklistChecklistUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist/${queryArg.id}/`,
          method: 'PUT',
          body: queryArg.checkListRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistPartialUpdate: build.mutation<
        ChecklistChecklistPartialUpdateApiResponse,
        ChecklistChecklistPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist/${queryArg.id}/`,
          method: 'PATCH',
          body: queryArg.patchedCheckListRequest,
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistChecklistDestroy: build.mutation<
        ChecklistChecklistDestroyApiResponse,
        ChecklistChecklistDestroyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/checklist/${queryArg.id}/`,
          method: 'DELETE',
        }),
        invalidatesTags: ['checklist'],
      }),
      runChecklist: build.mutation<RunChecklistApiResponse, RunChecklistApiArg>({
        query: (queryArg) => ({
          url: `/api/checklist/checklist/${queryArg.id}/run/`,
          method: 'POST',
        }),
        invalidatesTags: ['checklist'],
      }),
      checklistProjectList: build.query<
        ChecklistProjectListApiResponse,
        ChecklistProjectListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/checklist/project/`,
          params: { page: queryArg.page, page_size: queryArg.pageSize },
        }),
        providesTags: ['checklist'],
      }),
      checklistProjectRetrieve: build.query<
        ChecklistProjectRetrieveApiResponse,
        ChecklistProjectRetrieveApiArg
      >({
        query: (queryArg) => ({ url: `/api/checklist/project/${queryArg.code}/` }),
        providesTags: ['checklist'],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as backendApi };
export type AuthCreateApiResponse = /** status 200  */ JwtAuthResponse;
export type AuthCreateApiArg = {
  customTokenObtainPairRequest: CustomTokenObtainPairRequestWrite;
};
export type AuthProfileRetrieveApiResponse = /** status 200  */ User;
export type AuthProfileRetrieveApiArg = void;
export type AuthRefreshCreateApiResponse = /** status 200  */ TokenRefreshRead;
export type AuthRefreshCreateApiArg = {
  tokenRefreshRequest: TokenRefreshRequestWrite;
};
export type AuthRegisterCreateApiResponse = /** status 201  */ JwtAuthResponse;
export type AuthRegisterCreateApiArg = {
  signUpRequest: SignUpRequestWrite;
};
export type AuthVerifyCreateApiResponse = unknown;
export type AuthVerifyCreateApiArg = {
  tokenVerifyRequest: TokenVerifyRequestWrite;
};
export type ChecklistChecklistListApiResponse = /** status 200  */ PaginatedCheckListListRead;
export type ChecklistChecklistListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  pageSize?: number;
  project?: string;
};
export type ChecklistChecklistCreateApiResponse = /** status 201  */ CheckListRead;
export type ChecklistChecklistCreateApiArg = {
  checkListRequest: CheckListRequest;
};
export type ChecklistChecklistRunListApiResponse = /** status 200  */ PaginatedCheckListRunListRead;
export type ChecklistChecklistRunListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  pageSize?: number;
  project?: string;
};
export type ChecklistChecklistRunItemCommentsCreateApiResponse =
  /** status 201  */ CheckListRunSectionItemCommentRead;
export type ChecklistChecklistRunItemCommentsCreateApiArg = {
  checkListRunSectionItemCommentRequest: CheckListRunSectionItemCommentRequest;
};
export type ChecklistChecklistRunItemsUpdateApiResponse =
  /** status 200  */ CheckListRunSectionItemRead;
export type ChecklistChecklistRunItemsUpdateApiArg = {
  /** A unique integer value identifying this CheckListRunSectionItem. */
  id: number;
  checkListRunSectionItemRequest: CheckListRunSectionItemRequest;
};
export type ChecklistChecklistRunItemsPartialUpdateApiResponse =
  /** status 200  */ CheckListRunSectionItemRead;
export type ChecklistChecklistRunItemsPartialUpdateApiArg = {
  /** A unique integer value identifying this CheckListRunSectionItem. */
  id: number;
  patchedCheckListRunSectionItemRequest: PatchedCheckListRunSectionItemRequest;
};
export type ChecklistChecklistRunRetrieveApiResponse = /** status 200  */ CheckListRunRead;
export type ChecklistChecklistRunRetrieveApiArg = {
  /** A unique integer value identifying this CheckListRun. */
  id: number;
};
export type ChecklistChecklistRunUpdateApiResponse = /** status 200  */ CheckListRunRead;
export type ChecklistChecklistRunUpdateApiArg = {
  /** A unique integer value identifying this CheckListRun. */
  id: number;
  checkListRunRequest: CheckListRunRequest;
};
export type ChecklistChecklistRunPartialUpdateApiResponse = /** status 200  */ CheckListRunRead;
export type ChecklistChecklistRunPartialUpdateApiArg = {
  /** A unique integer value identifying this CheckListRun. */
  id: number;
  patchedCheckListRunRequest: PatchedCheckListRunRequest;
};
export type ChecklistChecklistRunStatisticRetrieveApiResponse =
  /** status 200  */ CheckListRunStatistic;
export type ChecklistChecklistRunStatisticRetrieveApiArg = {
  project?: string;
};
export type ChecklistChecklistRetrieveApiResponse = /** status 200  */ CheckListRead;
export type ChecklistChecklistRetrieveApiArg = {
  /** A unique integer value identifying this CheckLists. */
  id: number;
};
export type ChecklistChecklistUpdateApiResponse = /** status 200  */ CheckListRead;
export type ChecklistChecklistUpdateApiArg = {
  /** A unique integer value identifying this CheckLists. */
  id: number;
  checkListRequest: CheckListRequest;
};
export type ChecklistChecklistPartialUpdateApiResponse = /** status 200  */ CheckListRead;
export type ChecklistChecklistPartialUpdateApiArg = {
  /** A unique integer value identifying this CheckLists. */
  id: number;
  patchedCheckListRequest: PatchedCheckListRequest;
};
export type ChecklistChecklistDestroyApiResponse = unknown;
export type ChecklistChecklistDestroyApiArg = {
  /** A unique integer value identifying this CheckLists. */
  id: number;
};
export type RunChecklistApiResponse = /** status 200  */ Id;
export type RunChecklistApiArg = {
  /** A unique integer value identifying this CheckLists. */
  id: number;
};
export type ChecklistProjectListApiResponse = /** status 200  */ PaginatedProjectListRead;
export type ChecklistProjectListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  pageSize?: number;
};
export type ChecklistProjectRetrieveApiResponse = /** status 200  */ ProjectRead;
export type ChecklistProjectRetrieveApiArg = {
  code: string;
};
export type JwtAuthResponse = {
  access: string;
  refresh: string;
};
export type CustomTokenObtainPairRequest = {};
export type CustomTokenObtainPairRequestWrite = {
  email: string;
  password: string;
};
export type User = {
  email: string;
  first_name: string;
  last_name: string;
};
export type TokenRefresh = {};
export type TokenRefreshRead = {
  access: string;
};
export type TokenRefreshRequest = {};
export type TokenRefreshRequestWrite = {
  refresh: string;
};
export type SignUpRequest = {
  email: string;
  first_name: string;
  last_name: string;
};
export type SignUpRequestWrite = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};
export type TokenVerifyRequest = {};
export type TokenVerifyRequestWrite = {
  token: string;
};
export type CheckListSectionItem = {
  id?: number | null;
  title: string;
  description?: string | null;
  order?: number;
};
export type CheckListSections = {
  id?: number | null;
  title: string;
  order?: number;
  items?: CheckListSectionItem[];
  description?: string;
};
export type CheckList = {
  title: string;
  created_by?: User;
  updated_by?: User;
  project: number;
  sections?: CheckListSections[];
};
export type CheckListRead = {
  id: number;
  title: string;
  created_at: string;
  created_by?: User;
  updated_at: string;
  updated_by?: User;
  project: number;
  sections?: CheckListSections[];
  line_items: number;
};
export type PaginatedCheckListList = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: CheckList[];
};
export type PaginatedCheckListListRead = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: CheckListRead[];
};
export type UserRequest = {
  email: string;
  first_name: string;
  last_name: string;
};
export type CheckListSectionItemRequest = {
  id?: number | null;
  title: string;
  description?: string | null;
  order?: number;
};
export type CheckListSectionsRequest = {
  id?: number | null;
  title: string;
  order?: number;
  items?: CheckListSectionItemRequest[];
  description?: string;
};
export type CheckListRequest = {
  title: string;
  created_by?: UserRequest;
  updated_by?: UserRequest;
  project: number;
  sections?: CheckListSectionsRequest[];
};
export type CheckListRunStatusEnum = 'STARTED' | 'CANCELED' | 'PAUSED' | 'PASSED' | 'FAILED';
export type CheckListRunSectionItemStatusEnum = 'NOT_PERFORMED' | 'PASSED' | 'FAILED';
export type CheckListRunSectionItemComment = {
  item: number;
  message: string;
};
export type CheckListRunSectionItemCommentRead = {
  id: number;
  item: number;
  message: string;
};
export type CheckListRunSectionItem = {
  title: string;
  description?: string;
  status: CheckListRunSectionItemStatusEnum;
  comments?: CheckListRunSectionItemComment[];
  order?: number;
};
export type CheckListRunSectionItemRead = {
  id: number;
  title: string;
  description?: string;
  status: CheckListRunSectionItemStatusEnum;
  comments?: CheckListRunSectionItemCommentRead[];
  order?: number;
};
export type CheckListRunSection = {
  title: string;
  description?: string;
  order?: number;
  items?: CheckListRunSectionItem[];
};
export type CheckListRunSectionRead = {
  id: number;
  title: string;
  description?: string;
  order?: number;
  items?: CheckListRunSectionItemRead[];
  progress: number;
};
export type CheckListRun = {
  checklist: string;
  created_by?: User;
  updated_by?: User;
  updated_at?: string | null;
  status: CheckListRunStatusEnum;
  duration: number;
  finished_at?: string | null;
  sections?: CheckListRunSection[];
};
export type CheckListRunRead = {
  id: number;
  checklist: string;
  created_by?: User;
  created_at: string;
  updated_by?: User;
  updated_at?: string | null;
  status: CheckListRunStatusEnum;
  duration: number;
  progress: number;
  finished_at?: string | null;
  sections?: CheckListRunSectionRead[];
  line_items: number;
  failed: number;
  passed: number;
};
export type PaginatedCheckListRunList = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: CheckListRun[];
};
export type PaginatedCheckListRunListRead = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: CheckListRunRead[];
};
export type CheckListRunSectionItemCommentRequest = {
  item: number;
  message: string;
};
export type CheckListRunSectionItemRequest = {
  title: string;
  description?: string;
  status: CheckListRunSectionItemStatusEnum;
  comments?: CheckListRunSectionItemCommentRequest[];
  order?: number;
};
export type PatchedCheckListRunSectionItemRequest = {
  title?: string;
  description?: string;
  status?: CheckListRunSectionItemStatusEnum;
  comments?: CheckListRunSectionItemCommentRequest[];
  order?: number;
};
export type CheckListRunSectionRequest = {
  title: string;
  description?: string;
  order?: number;
  items?: CheckListRunSectionItemRequest[];
};
export type CheckListRunRequest = {
  checklist: string;
  created_by?: UserRequest;
  updated_by?: UserRequest;
  updated_at?: string | null;
  status: CheckListRunStatusEnum;
  duration: number;
  finished_at?: string | null;
  sections?: CheckListRunSectionRequest[];
};
export type PatchedCheckListRunRequest = {
  checklist?: string;
  created_by?: UserRequest;
  updated_by?: UserRequest;
  updated_at?: string | null;
  status?: CheckListRunStatusEnum;
  duration?: number;
  finished_at?: string | null;
  sections?: CheckListRunSectionRequest[];
};
export type CheckListRunStatistic = {
  average_duration: number;
  total_duration: number;
  total?: number;
  passed?: number;
  started?: number;
  failed?: number;
};
export type PatchedCheckListRequest = {
  title?: string;
  created_by?: UserRequest;
  updated_by?: UserRequest;
  project?: number;
  sections?: CheckListSectionsRequest[];
};
export type Id = {
  id: number;
};
export type LevelEnum = 'MVP' | 'ENTERPRISE';
export type Project = {
  title: string;
  code: string;
  level?: LevelEnum;
};
export type ProjectRead = {
  id: number;
  title: string;
  code: string;
  level?: LevelEnum;
  created_at: string;
  updated_at: string;
};
export type PaginatedProjectList = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Project[];
};
export type PaginatedProjectListRead = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: ProjectRead[];
};
export const {
  useAuthCreateMutation,
  useAuthProfileRetrieveQuery,
  useAuthRefreshCreateMutation,
  useAuthRegisterCreateMutation,
  useAuthVerifyCreateMutation,
  useChecklistChecklistListQuery,
  useChecklistChecklistCreateMutation,
  useChecklistChecklistRunListQuery,
  useChecklistChecklistRunItemCommentsCreateMutation,
  useChecklistChecklistRunItemsUpdateMutation,
  useChecklistChecklistRunItemsPartialUpdateMutation,
  useChecklistChecklistRunRetrieveQuery,
  useChecklistChecklistRunUpdateMutation,
  useChecklistChecklistRunPartialUpdateMutation,
  useChecklistChecklistRunStatisticRetrieveQuery,
  useChecklistChecklistRetrieveQuery,
  useChecklistChecklistUpdateMutation,
  useChecklistChecklistPartialUpdateMutation,
  useChecklistChecklistDestroyMutation,
  useRunChecklistMutation,
  useChecklistProjectListQuery,
  useChecklistProjectRetrieveQuery,
} = injectedRtkApi;
