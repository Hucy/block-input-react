import React, { Component } from 'react';
import styled from 'styled-components';
interface IBlockState {
  values: string[];
  input: string;
  length: number;
  curIndex: number;
  focused: boolean;
}

interface IBlockProps {
  length?: number;
  mask?: string;
  className?: string;
  placeholder?: string;
  onChange?(v: string): void;
  onFocus?(): void;
  onBlur?(): void;
}

interface IBlockElProps {
  current: boolean;
}

const BlockEl = styled.span<IBlockElProps>`
  width: 35px;
  height: 35px;
  box-sizing: border-box;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes flash {
    from,
    50%,
    to {
      opacity: 1;
    }
    25%,
    75% {
      opacity: 0;
    }
  }
  &::before {
    content: '';
    display: ${props => (props.current ? 'block' : 'none')};
    height: 15px;
    width: 1px;
    background: rgb(0, 0, 0);
    margin-left: 2px;
    animation: flash 2s infinite both;
  }
`;
const BlockElWrap = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
const Input = styled.input`
  width: 0;
  height: 0;
  opacity: 0.1;
  position: absolute;
  z-index: -1;
`;

const BlockInputWrap = styled.div`
  position: relative;
`;

class BlockInput extends Component<IBlockProps> {
  public state: IBlockState;
  public input: HTMLInputElement;
  public defaultValues: string[];
  constructor(props) {
    super(props);

    const { length = 6, placeholder = '' } = props;
    this.defaultValues = Array(length).fill(placeholder);

    this.state = {
      values: this.defaultValues,
      input: '',
      curIndex: 0,
      focused: false,
      length,
    };

    this.onChange = this.onChange.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  public onChange(e) {
    const { length } = this.state;
    const { mask, onChange } = this.props;
    const input: string = e.target.value;
    const values: string[] = input.split('');

    if (values.length > length) {
      return;
    }
    const newStateValues = values.reduce(
      (old, cur, index) => {
        old[index] = mask || cur;
        return old;
      },
      [...this.defaultValues]
    );
    this.setState(
      {
        input,
        curIndex: values.length,
        values: newStateValues,
      },
      () => {
        if (onChange) {
          onChange(input);
        }
      }
    );
  }

  public inputFocus() {
    this.input.focus();
    this.setState(
      {
        focused: true,
      },
      () => {
        const { onFocus } = this.props;
        if (onFocus) {
          onFocus();
        }
      }
    );
  }

  public onBlur() {
    this.setState(
      {
        focused: false,
      },
      () => {
        const { onBlur } = this.props;
        if (onBlur) {
          onBlur();
        }
      }
    );
  }

  public render() {
    const { values, input, curIndex, focused } = this.state;
    const { className } = this.props;

    return (
      <BlockInputWrap className={className}>
        <Input
          ref={el => {
            this.input = el;
          }}
          value={input}
          type="text"
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
        <BlockElWrap onClick={this.inputFocus}>
          {values.map((v, k) => (
            <BlockEl key={k} current={curIndex === k && focused}>
              {v}
            </BlockEl>
          ))}
        </BlockElWrap>
      </BlockInputWrap>
    );
  }
}

export default BlockInput;
