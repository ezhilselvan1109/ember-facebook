import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserDataService extends Service {
  @tracked user = {};
  @tracked errorMessage = '';
}
