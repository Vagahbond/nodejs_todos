export interface Config {
  jwtSecret: string;
}

export function getConfig(): Config {
  return {
    jwtSecret: process.env.JWT_SECRET ?? "secret",
  };
}
