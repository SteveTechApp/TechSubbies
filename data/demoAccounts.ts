export type DemoRole = "Admin" | "Engineer" | "Company" | "Resourcing Company";

export type DemoAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
};

export type DemoSession = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  signedInAt: string;
};

export const isDemoAccessEnabled = import.meta.env.DEV;

export const demoAccounts: DemoAccount[] = isDemoAccessEnabled ? [
  {
    id: "demo-admin",
    name: "Demo Admin",
    email: "admin@techsubbies.demo",
    password: "password",
    role: "Admin",
  },
] : [];

export const demoSessionKey = "techsubbies_demo_session";

export function getDemoSession(): DemoSession | null {
  if (!isDemoAccessEnabled || typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(demoSessionKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    window.localStorage.removeItem(demoSessionKey);
    return null;
  }
}

export function setDemoSession(account: DemoAccount): DemoSession {
  if (!isDemoAccessEnabled) {
    throw new Error("Demo access is disabled in production.");
  }
  const session: DemoSession = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(demoSessionKey, JSON.stringify(session));
  return session;
}

export function clearDemoSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(demoSessionKey);
}

export function validateDemoLogin(email: string, password: string): DemoAccount | null {
  if (!isDemoAccessEnabled) {
    return null;
  }
  const normalisedEmail = email.trim().toLowerCase();

  return (
    demoAccounts.find(
      (account) =>
        account.email.toLowerCase() === normalisedEmail &&
        account.password === password
    ) || null
  );
}
