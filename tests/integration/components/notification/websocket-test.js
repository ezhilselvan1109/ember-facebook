import { module, test } from 'qunit';
import { setupRenderingTest } from 'facebook/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | notification/websocket', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Notification::Websocket />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Notification::Websocket>
        template block text
      </Notification::Websocket>
    `);

    assert.dom().hasText('template block text');
  });
});
