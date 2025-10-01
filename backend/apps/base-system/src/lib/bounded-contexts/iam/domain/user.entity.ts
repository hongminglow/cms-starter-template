export interface UserProps {
  id: string;
  username: string;
  email: string | null;
  passwordHash: string;
  createdAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string | null {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
