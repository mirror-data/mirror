export const getValueFromEnv = (name: string, isBase64: boolean = false): string => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error(`Environment variable ${name} is not defined`);
    }
    if (isBase64) {
      return Buffer.from(value, 'base64').toString('ascii');
    }
    return value;
}
