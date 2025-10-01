export interface LoginResultDto {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string | null;
  };
}
