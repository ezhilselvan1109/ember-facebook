import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SignupController extends Controller {
  @service router;
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked phoneNumber = '';
  @tracked email = '';
  @tracked dateOfBirth = '';
  @tracked password = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;

  @action
  updateFirstName(event) {
    this.firstName = event.target.value;
  }

  @action
  updateLastName(event) {
    this.lastName = event.target.value;
  }

  @action
  updatePhoneNumber(event) {
    this.phoneNumber = event.target.value;
  }

  @action
  updateDateOfBirth(event) {
    this.dateOfBirth = event.target.value;
  }

  @action
  updateEmail(event) {
    this.email = event.target.value;
  }
  @action
  updatePassword(event) {
    this.password = event.target.value;
  }
  validateForm() {
    this.errorMessage = '';
    if(this.firstName=='' || this.lastName=='' || this.email=='' || this.phoneNumber==''|| this.password=='' || this.dateOfBirth==''){
      this.errorMessage="Fill the Form"
      return false;
    }
    return true;
  }

  @action
  async signUpUser(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;

    const formData = new URLSearchParams({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phoneNumber,
      password: this.password,
      dateOfBirth: this.dateOfBirth,
    });

    try {
      let response = await fetch(
        'http://localhost:8080/facebook/api/user/account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
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
