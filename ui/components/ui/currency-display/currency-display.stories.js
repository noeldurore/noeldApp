import React from 'react';
import { decimalToHex } from '../shared/modules/conversion.utils';
import { EtherDenomination } from '../shared/constants/common';
import CurrencyDisplay from './CurrencyDisplay';

export default {
  title: 'CurrencyDisplay',
  argTypes: {
    className,
    currency,
    'data-testid',
    denomination,
    displayValue,
    hideLabel,
    hideTitle,
    numberOfDecimals,
    prefix = '',
    prefixComponent = '',
    style = {},
    suffix = '',
  },
  args: {
    denomination: EtherDenomination.ETH,
  },
};

export const DefaultStory = (args) => <CurrencyDisplay {...args} />;
DefaultStory.storyName = 'Default';

export const DisplayValueStory = (args) => (
  <CurrencyDisplay {...args} displayValue="44.43" />
);
DefaultStory.storyName = 'Display Value';
