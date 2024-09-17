import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SearchNav extends Component {
  @service userData;
  @tracked searchQuery = '';
  @tracked searchResults = [];
  @tracked isLoading = false;
  debounceTimeout = null;

  get user_id() {
    return this.userData.user.id;
  }

  @action
  performSearch(event) {
    this.searchQuery = event.target.value;
    if (!this.searchQuery) this.searchResults = [];
    this.debounceSearch(this.searchQuery);
  }

  @action
  clearSearchResults() {
    this.searchResults = [];
    this.searchQuery = '';
    this.isLoading = false;
  }

  debounceSearch(query) {
    if(query===''){
      this.isLoading = false;
      return;
    }
    if (query.length > 0) {
      this.isLoading = true;
    }
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.fetchResults(query);
    }, 1000);
  }

  async fetchResults(query) {
    if (query.length > 0) {
      this.isLoading = true;
      try {
        let response = await fetch(
          `http://localhost:8080/facebook/api/user/search?key=${query}&id=${this.userData.user.id}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        let results = await response.json();
        this.searchResults = results.data;
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.searchResults = [];
    }
  }
}
