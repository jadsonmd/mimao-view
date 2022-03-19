// eslint-disable-next-line consistent-return
export default ({ app, redirect }) => {
  const appRouter = app.router.app;
  // eslint-disable-next-line no-underscore-dangle
  if (appRouter._route.fullPath === '/') {
    return redirect('/login');
  }
  if (!appRouter.$auth.isAuthenticated()) {
    return redirect('/login');
  }
};
