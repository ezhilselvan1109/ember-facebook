import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ForgottenController extends Controller {
  @service router;
  @tracked username = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;

  @action
  updateUserId(event) {
    this.username = event.target.value;
  }

  validateForm() {
    this.errorMessage = '';
    if(this.username==''){
      this.errorMessage="Fill the Form"
      return false;
    }
    return true;
  }

  @action
  async searchUser(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/auth/forgotPassword?username=${this.username}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = errorData.data.join(', ');
      } else {
        let result = await response.json();
        this.router.transitionTo('password', result.data.id);
      }
    } catch (error) {
      this.errorMessage = error;
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
