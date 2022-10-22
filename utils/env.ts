export const getValueFromEnv = (name: string): string => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error(`Environment variable ${name} is not defined`);
    }
    return value;
}
