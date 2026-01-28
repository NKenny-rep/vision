

import { ROUTES, buildRoute } from '~/constants/routes'

export const useAppRoutes = () => {
  const localePath = useLocalePath()

  return {
    // Localized route paths
    auth: {
      login: () => localePath(ROUTES.LOGIN),
      register: () => localePath(ROUTES.REGISTER),
    },
    user: {
      browse: () => localePath(ROUTES.BROWSE),
      search: () => localePath(ROUTES.SEARCH),
      myList: () => localePath(ROUTES.MY_LIST),
      profile: () => localePath(ROUTES.PROFILE),
      watch: (id: string) => localePath(buildRoute.watch(id)),
    },
    admin: {
      dashboard: () => localePath(ROUTES.DASHBOARD),
      users: () => localePath(ROUTES.USERS),
      videos: () => localePath(ROUTES.VIDEOS),
    },
    public: {
      home: () => localePath(ROUTES.HOME),
    },
    legal: {
      privacy: () => localePath(ROUTES.PRIVACY_POLICY),
      terms: () => localePath(ROUTES.TERMS_OF_SERVICE),
    },
  }
}
