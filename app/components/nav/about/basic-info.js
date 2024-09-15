import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class NavAboutBasicInfo extends Component {
  @service about;
  @tracked gender = '2';
  @tracked dateOfBirth = '11-09-2001';
  @tracked genderEdit = false;

  @action
  setGenderEdit(value) {
    this.genderEdit = value;
  }

  @action
  updateGender(event) {
    this.gender = event.target.value;
  }

  @action
  submitGender(event) {
    event.preventDefault();
    console.log('hello', this.gender);
  }
}
