// next-auth.config.js
export default {
  providers: [
    {
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      version: '2.0',
      scope: 'user',
      params: { grant_type: 'authorization_code' },
      accessTokenUrl: 'https://github.com/login/oauth/access_token',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      profileUrl: 'https://api.github.com/user',
      clientId: '8af17b543d68a113f2c1',
      clientSecret: 'd6a845356e299f53d2315614bba0f90f0e318c6c ',
    },
  ],
};
