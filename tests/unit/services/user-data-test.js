import { module, test } from 'qunit';
import { setupTest } from 'facebook/tests/helpers';

module('Unit | Service | user-data', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:user-data');
    assert.ok(service);
  });
});
