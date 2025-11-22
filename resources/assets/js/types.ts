export interface User {
  id: number | string;
  name?: string;
  email: string;
  token?: string;
}

export default User;
