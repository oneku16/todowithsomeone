export interface SessionUser {
  userId: string;
  username: string;
  displayName: string;
}

export interface SessionData {
  user?: SessionUser;
}

declare module "iron-session" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation
  interface IronSessionData extends SessionData {}
}
