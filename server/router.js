const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  // app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Post.make);
  // app.post('/deleteDomo', mid.requiresLogin, controllers.Domo.delete);
  
  app.get('/browse', mid.requiresSecure, controllers.Browse.displayPosts);
  app.get('/edit', mid.requiresLogin, controllers.Post.editPage);
  app.post('/edit', mid.requiresLogin, controllers.Post.editPost);
  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  app.post('/change', mid.requiresLogin, controllers.Account.changePassword);
  app.post('/deletePost', mid.requiresLogin, controllers.Post.deletePost);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
