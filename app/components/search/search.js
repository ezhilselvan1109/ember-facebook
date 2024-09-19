import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SearchSearch extends Component {
  @service userData;
  @tracked searchQuery = '';
  @tracked searchResults = [];
  @tracked isLoading = false;
  debounceTimeout = null;

  @action
  performSearch(event) {
    this.searchQuery = event.target.value;
    if (!this.searchQuery) this.searchResults = [];
    this.debounceSearch(this.searchQuery);
  }

  @action
  clearSearchResults(result) {
    if (this.args.handleTag) this.args.handleTag(result);
    this.searchResults = [];
    this.searchQuery = '';
    this.isLoading = false;
  }

  debounceSearch(query) {
    if (query === '') {
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
          `http://localhost:8080/facebook/api/user/search?key=${query}`,
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
