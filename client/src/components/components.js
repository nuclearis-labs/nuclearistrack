// components.js
import styled from 'styled-components';
export const Wrap = styled.div``;
export const Title = styled.h1`
  color: #5d5d5d;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 34px;
  letter-spacing: 2px;
  line-height: 37px;
`;
export const Label = styled.label`
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1.5px;
  line-height: 26px;
  text-align: left;
  display: block;
  margin-top: 10px;
`;

export const Input = styled.input`
  border: solid 2px #5d5d5d;
  width: 370px;
  height: 36px;
  padding: 5px;
  color: #555;
  cursor: text;
  font-size: 14px;
  font-weight: 300;
  box-sizing: border-box;
  background: transparent;
  &:active,
  &:focus {
    text-align: left;
  }
`;
export const TextArea = styled.textarea`
  border: solid 2px #5d5d5d;
  width: 370px;
  height: 200px;
  padding: 5px;
  color: #555;
  cursor: text;
  font-size: 14px;
  font-weight: 300;
  box-sizing: border-box;
  background: transparent;
  &:active,
  &:focus {
    text-align: left;
  }
`;
export const Button = styled.button`
  background: #8c6239;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  padding: 5px 10px;
  letter-spacing: 1px;
  display: block;
  margin-top: 20px;
  &.submit {
    position: relative;
    top: 60px;
    margin-top: 0;
  }
`;

export const Checkbox = styled.input.attrs(props => ({
  type: 'checkbox'
}))`
	display:block;

	& + label span {
		display: inline-block;
		width: 23px;
		height: 23px;
		vertical-align: middle;
		cursor: pointer;
		box-sizing: border-box;
		background:transparent;
		border: solid 2px #5d5d5d;
		margin-right: 10px;
	}
	&:checked + label span {
		background: #8c6239;
    	box-shadow: inset rgba(0,0,0,0.4) 0px 0px 6px 6px;
		}
	}
`;

export const Datepicker = styled.input.attrs(props => ({
  type: 'date'
}))`
  border: solid 2px #5d5d5d;
  width: 207px;
  height: 36px;
  padding: 5px;
  color: #555;
  box-sizing: border-box;
  background: transparent;
`;

export const Select = styled.select`
  border: solid 2px #5d5d5d;
  background: transparent;
  width: 370px;
  height: 36px;
  font-size: 14px;
  font-weight: 300;
  box-sizing: border-box;
  color: #555;
  padding: 5px;
  &:active,
  &:focus {
    text-align: left;
  }
`;
