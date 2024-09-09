import { module, test } from 'qunit';
import { setupRenderingTest } from 'facebook/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | post', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Post />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Post>
        template block text
      </Post>
    `);

    assert.dom().hasText('template block text');
  });
});
