import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { Setting, SettingType } from '../../utils/settings';
import { SettingsSection } from './settings-section';

describe('SettingsSection component', () => {
  const setting1: Setting = {
    key: 'setting1',
    name: 'Setting 1 name',
    description: 'Setting 1 description',
    value: 5,
    type: SettingType.CURRENCY
  };

  const setting2: Setting = {
    key: 'setting2',
    name: 'Setting 12 name',
    description: 'Setting 2 description',
    value: 10,
    type: SettingType.CURRENCY
  };

  it('renders label', () => {
    const { getByText } = render(<SettingsSection settings={[setting1]} onChange={() => {}}></SettingsSection>);

    expect(getByText(setting1.name + ':')).toBeInTheDocument();
  });

  it('renders text field', () => {
    const { getByRole } = render(<SettingsSection settings={[setting1]} onChange={() => {}}></SettingsSection>);

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders description', () => {
    const { getByRole } = render(<SettingsSection settings={[setting1]} onChange={() => {}}></SettingsSection>);

    expect(getByRole('button')).toBeInTheDocument();
  });

  it('renders multiple rows', () => {
    const settings = [setting1, setting2];
    const { getAllByRole } = render(<SettingsSection settings={settings} onChange={() => {}}></SettingsSection>);

    expect(getAllByRole('textbox')).toHaveLength(settings.length);
  });

  it('calls onChange on text field change', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<SettingsSection settings={[setting1]} onChange={onChange}></SettingsSection>);

    fireEvent.input(getByRole('textbox'), { target: { value: '6' } });

    expect(onChange).toBeCalledTimes(1);
  });

  it('calls onChange with proper arguments', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<SettingsSection settings={[setting1]} onChange={onChange}></SettingsSection>);

    fireEvent.input(getByRole('textbox'), { target: { value: '6' } });

    expect(onChange).toBeCalledWith(setting1.key, 6);
  });
});
