import { module, test } from 'qunit';
import { setupRenderingTest } from 'facebook/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | friend', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Friend />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Friend>
        template block text
      </Friend>
    `);

    assert.dom().hasText('template block text');
  });
});
