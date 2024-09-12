import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PasswordRoute extends Route {
  @service router;
  beforeModel() {
    let user = localStorage.getItem('user');
    if (user) {
      this.router.transitionTo('index');
    }
  }
  model(params) {
    const { id } = params;
    return id;
  }
}
