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
    if (this.password == '') {
      this.errorMessage = 'Fill the Form';
      return false;
    }
    return true;
  }

  @action
  async changePassword(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    const data = {
      id: this.model,
      password: this.password,
    };

    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/auth/changePassword`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = errorData.data.join(', ');
      } else {
        this.router.transitionTo('login');
      }
    } catch (error) {
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
