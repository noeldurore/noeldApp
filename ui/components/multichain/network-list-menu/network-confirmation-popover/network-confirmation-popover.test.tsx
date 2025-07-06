import React from 'react';
import configureMockStore from 'redux-mock-store';
import { ApprovalType } from '@noeldapp/controller-utils';
import { renderWithProvider } from '../../../../../test/lib/render-helpers';
import mockState from '../../../../../test/data/mock-state.json';
import NetworkConfirmationPopover from './network-confirmation-popover';

const mockStore = configureMockStore([]);

describe('NetworkConfirmationPopover', () => {
  it('renders popular list component', () => {
    const store = mockStore({
      ...mockState,
      unapprovedConfirmations: [
        { id: '1', origin: 'noeldapp', type: ApprovalType.AddEthereumChain },
      ],
    });

    const { container } = renderWithProvider(<NetworkConfirmationPopover />, store);
    expect(container).toMatchSnapshot();
  });

  it('does not render the popover when there are no unapproved AddEthereumChain confirmations', () => {
    const store = mockStore({ ...mockState, unapprovedConfirmations: [] });
    const { queryByText } = renderWithProvider(<NetworkConfirmationPopover />, store);
    expect(queryByText('ConfirmationPage content')).not.toBeInTheDocument();
  });
});
