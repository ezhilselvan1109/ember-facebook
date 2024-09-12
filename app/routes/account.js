import Route from '@ember/routing/route';

export default class AccountRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.loadData();
  }

  model(params) {
    let id = params.id;
    return id;
  }
}
