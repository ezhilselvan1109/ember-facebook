import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service router;

  beforeModel(transition) {
    let user = localStorage.getItem('user');
    if (!user) {
      if (
        transition.to.name !== 'signup' ||
        transition.to.name !== 'forgotpassword' ||
        transition.to.name !== 'login'
      ) {
        this.router.transitionTo('login');
      }
    } else {
      if (['login', 'signup', 'forgotpassword'].includes(transition.to.name)) {
        this.router.transitionTo('index');
      }
    }
  }

  model() {
    let user = localStorage.getItem('user');
    return user ? true : false;
  }
}
