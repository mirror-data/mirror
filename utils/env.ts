export const get_value_from_env = (name: string): string => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error(`Environment variable ${name} is not defined`);
    }
    return value;
}
