import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import config from '../../../next-auth.config';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: config.providers[0].clientId,
      clientSecret: config.providers[0].clientSecret,
    }),
  ],
});
