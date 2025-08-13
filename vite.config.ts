import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  // For https
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),
  //   },
  // },
});
