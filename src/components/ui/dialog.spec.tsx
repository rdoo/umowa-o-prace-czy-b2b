import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { Dialog } from './dialog';

describe('Dialog component', () => {
  it('is closed', () => {
    const { queryByRole } = render(<Dialog title="test-title" open={false} onClose={() => {}}></Dialog>);

    expect(queryByRole('dialog')).toBeNull();
  });

  it('is opened', () => {
    const { getByRole } = render(<Dialog title="test-title" open={true} onClose={() => {}}></Dialog>);

    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onClose on close button click', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(<Dialog title="test-title" open={true} onClose={onClose}></Dialog>);

    fireEvent.click(getByLabelText('zamknij', { exact: false }));

    expect(onClose).toBeCalledTimes(1);
  });

  it('renders title', () => {
    const title = 'test-title';
    const { getByRole } = render(<Dialog title={title} open={true} onClose={() => {}}></Dialog>);

    expect(getByRole('heading')).toHaveTextContent(title);
  });

  it('renders children', () => {
    const children = <div data-testid="test-children">test children</div>;
    const { getByTestId } = render(
      <Dialog title="test-title" open={true} onClose={() => {}}>
        {children}
      </Dialog>
    );

    expect(getByTestId('test-children')).toBeInTheDocument();
  });

  it('is full width', () => {
    const { getByRole } = render(<Dialog title="test-title" open={true} onClose={() => {}} fullWidth={true}></Dialog>);

    expect(
      getByRole('dialog')
        .className.toLowerCase()
        .includes('fullwidth')
    ).toBe(true);
  });
});
