/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects() {
    //редирект пользователя при попытке попасть на страницу /todos
    return [
      {
        source: '/todos',
        destination: '/',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
