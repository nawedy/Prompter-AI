interface EnvConfig {
  VITE_API_URL: string;
  VITE_HUGGINGFACE_TOKEN: string;
  // Add other environment variables here
}

function validateEnv(): EnvConfig {
  const requiredEnvVars: (keyof EnvConfig)[] = [
    'VITE_API_URL',
    'VITE_HUGGINGFACE_TOKEN',
  ];

  const missingVars = requiredEnvVars.filter(
    (key) => !import.meta.env[key]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    );
  }

  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_HUGGINGFACE_TOKEN: import.meta.env.VITE_HUGGINGFACE_TOKEN,
  };
}

export const env = validateEnv();
