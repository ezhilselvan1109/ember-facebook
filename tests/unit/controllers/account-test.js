import { module, test } from 'qunit';
import { setupTest } from 'facebook/tests/helpers';

module('Unit | Controller | account', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:account');
    assert.ok(controller);
  });
});
