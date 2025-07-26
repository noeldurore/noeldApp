import { strict as assert } from 'assert';
import FixtureBuilder from '../../fixture-builder';
import { withFixtures, WINDOW_TITLES } from '../../helpers';
import { DEFAULT_FIXTURE_ACCOUNT } from '../../constants';
import HomePage from 'page-objects/pages/home/homepage';
import ReviewPermissionsConfirmation from 'page-objects/pages/confirmations' +
  '/redesign' + '/review-permissions-confirmation';
import TestDapp from 'page-objects' + '/pages' + '/test-dapp';
