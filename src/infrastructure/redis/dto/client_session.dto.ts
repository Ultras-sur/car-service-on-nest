export class ClintSessionInfo {
  readonly session: string;
  readonly client: {
    id: string;
    login: string;
    name: string;
    roles: [];
  };
}
