import 'jest-styled-components';
import React from 'react';

import { mount, shallow } from 'enzyme';

import BlockInput from '../src';

test('should render correctly', () => {
  const wrapper = mount(<BlockInput />);
  expect(wrapper).toMatchSnapshot();

  expect(wrapper.find('input').length).toBe(1);
  expect(wrapper.find('span').length).toBe(6);
});

test('custom className should succeed', () => {
  const wrapper = shallow(<BlockInput className="custom-class-name" />);
  expect(wrapper.hasClass('custom-class-name')).toBe(true);
});

test('custom length should succeed', () => {
  const wrapper = mount(<BlockInput length={4} />);
  expect(wrapper.find('span').length).toBe(4);
});

test('custom placeholder should succeed', () => {
  const wrapper = mount(<BlockInput placeholder="_" />);
  expect(
    wrapper
      .find('span')
      .at(0)
      .text()
  ).toBe('_');
});

test('custom mask should succeed', () => {
  const wrapper = mount(<BlockInput mask="*" />);
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: '111' } });

  expect(wrapper.state('input')).toBe('111');
  const texts = wrapper.find('span').map(v => v.text());
  expect(texts).toEqual(['*', '*', '*', '', '', '']);
});

describe('event should succeed', () => {
  test('focus and blur event', () => {
    const wrapper = mount(<BlockInput />);
    expect(wrapper.state('focused')).toBe(false);
    wrapper
      .find('div')
      .at(1)
      .simulate('click');
    expect(wrapper.state('focused')).toBe(true);

    wrapper
      .find('input')
      .at(0)
      .simulate('blur');
    expect(wrapper.state('focused')).toBe(false);
  });

  test('props focus and blur event', () => {
    const propsFocusFn = jest.fn();
    const propsBlurFn = jest.fn();

    const wrapper = mount(
      <BlockInput onFocus={propsFocusFn} onBlur={propsBlurFn} />
    );

    wrapper
      .find('div')
      .at(1)
      .simulate('click');
    expect(propsFocusFn).toBeCalled();

    wrapper
      .find('input')
      .at(0)
      .simulate('blur');
    expect(propsBlurFn).toBeCalled();
  });

  test('props change event', () => {
    const propsChangeFn = jest.fn();
    const wrapper = mount(<BlockInput onChange={propsChangeFn} />);
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: '111' } });
    expect(wrapper.state('input')).toBe('111');
    expect(propsChangeFn).toBeCalledWith('111');

    const texts = wrapper.find('span').map(v => v.text());
    expect(texts).toEqual(['1', '1', '1', '', '', '']);

    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: '1111111' } });
    expect(wrapper.state('input')).toBe('111');
  });
});
