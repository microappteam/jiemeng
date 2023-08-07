const NextAuth = require('next-auth');
const GithubProvider = require('next-auth/providers/github');

const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user = { ...session.user, ...user };
      }
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.login,
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
};

module.exports = NextAuth(authOptions);
