export const requiredEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
] as const;

export const validateEnv = (): void => {
  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.error("Error: Faltan las siguientes variables de entorno:");
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error("\nPor favor, configura estas variables en tu archivo .env");
    process.exit(1);
  }

  console.log("Todas las variables de entorno requeridas están configuradas");
};
