import type { Request } from "express";

export type AuthenticatedRequest<UserShape = { id: string }> = Request & {
  user: UserShape;
};
