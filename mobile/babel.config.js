module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowlist: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@grammar': '../src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};