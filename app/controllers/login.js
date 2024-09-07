import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked userName = '';
  @tracked password = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;
  
  @action
  updateEmail(event) {
    this.userName = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  validateForm() {
    if (!this.userName || !this.password) {
      this.errorMessage = 'Both email and password are required';
      return false;
    }
    this.errorMessage = '';
    return true;
  }
  
  @action
  async loginUser(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    const loginData = {
      email: this.userName,
      password: this.password,
    };
    try {
      let response = await fetch(
        `http://localhost:8080/facebook/api/auth/login?userName=${this.userName}&password=${this.password}`,
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse the JSON response
        console.log('response:', errorData); // Log the actual error message
        throw new Error(`${errorData.message}. ${errorData.data.join(', ')}`);
      }
      let result = await response.json();
      console.log('Result : ', result);
      alert(`Login successful! Welcome, ${result}`);
    } catch (error) {
      this.errorMessage = error;
      console.log('Error : ' + error);
    } finally {
      this.isLoading = false;
    }
  }
}
