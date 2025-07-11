import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../store/store';
import testData from '../../../.storybook/test-data';
import RemoveSnapAccount from './remove-snap-account';

const store = configureStore(testData);

export default {
  title: 'Components/UI/RemoveSnapAccount',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

export const Default = () => (
  <RemoveSnapAccount
    snapId="npm:@noeldapp/snap-simple-keyring"
    snapName="Test name"
    publicAddress="0x64a845a5b02460acf8a3d84503b0d68d028b4bb4"
  />
);
