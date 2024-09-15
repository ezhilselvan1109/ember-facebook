import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SessionService extends Service {
  @service router;

  route(){
    this.router.transitionTo('login');
  }
}
