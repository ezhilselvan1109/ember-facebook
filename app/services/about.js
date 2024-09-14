import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AboutService extends Service {
  @tracked data;

  async fetchData() {
    try {
      let response = await fetch(`http://localhost:8080/facebook/api/user/user1@gmail.com`,{ method: 'GET' });
      let result = await response.json();
      this.data = result;
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
