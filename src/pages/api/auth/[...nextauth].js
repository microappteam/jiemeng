import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // 可以添加其他身份验证提供程序，如 Google、Facebook 等
  ],
};

export default (req, res) => NextAuth(req, res, options);
