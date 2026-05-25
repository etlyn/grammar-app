declare module '@env' {
  export const SUPABASE_URL: string | undefined;
  export const SUPABASE_ANON_KEY: string | undefined;
}

declare module '*.png' {
  const value: number;
  export default value;
}