import { Role } from "../types";

const dashboardPaths: Record<Role, string> = {
  [Role.ENGINEER]: "/engineer/dashboard",
  [Role.COMPANY]: "/company/dashboard",
  [Role.RESOURCING_COMPANY]: "/resourcing/dashboard",
  [Role.ADMIN]: "/admin/dashboard",
};

export function dashboardPathForRole(role: Role | string | undefined): string {
  return role && role in dashboardPaths ? dashboardPaths[role as Role] : "/";
}
