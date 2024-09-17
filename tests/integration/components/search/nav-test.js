import { module, test } from 'qunit';
import { setupRenderingTest } from 'facebook/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | search/nav', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Search::Nav />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Search::Nav>
        template block text
      </Search::Nav>
    `);

    assert.dom().hasText('template block text');
  });
});
