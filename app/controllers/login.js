import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LoginController extends Controller {
  @service router;
  @tracked username = '';
  @tracked password = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;

  @action
  updateEmail(event) {
    this.username = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  validateForm() {
    this.errorMessage = '';
    if (this.username == '' || this.password == '') {
      this.errorMessage = 'Fill the Form';
      return false;
    }
    return true;
  }

  @action
  async loginUser(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const data = {
      username: this.username,
      password: this.password,
    };
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = errorData.data.join(', ');
      } else {
        localStorage.setItem('user', this.username);
        this.router.transitionTo('index');
      }
    } catch (error) {
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
