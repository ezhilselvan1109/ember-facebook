import Route from '@ember/routing/route';

export default class PasswordRoute extends Route {
  model(params) {
    const { id } = params;
    return id;
  }
}
