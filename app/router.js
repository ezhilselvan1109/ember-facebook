import EmberRouter from '@ember/routing/router';
import config from 'facebook/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('not-found', { path: '/*path' });
  this.route('login');
  this.route('forgotten');
  this.route('password', { path: '/password/:id' });
});
