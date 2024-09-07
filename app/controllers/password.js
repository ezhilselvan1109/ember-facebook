import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PasswordController extends Controller {
  @service router;
  @tracked password = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  validateForm() {
    this.errorMessage = '';
    return true;
  }

  @action
  async changePassword(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/auth/changePassword?id=${this.model}&password=${this.password}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log('response:', errorData);
        throw new Error(`${errorData.message}. ${errorData.data.join(', ')}`);
      } else {
        let result = await response.json();
        console.log('Result : ', result);this.router.transitionTo('login');
      }
    } catch (error) {
      this.errorMessage = error;
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
