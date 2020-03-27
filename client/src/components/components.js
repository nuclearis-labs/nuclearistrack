// components.js
import styled from 'styled-components';
export const Scroll = styled.div`
  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-thumb {
    background: #5d5d5d;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

export const Title = styled.h1`
  color: #5d5d5d;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 34px;
  letter-spacing: 2px;
  line-height: 37px;
  margin-top: 23px;
  margin-bottom: 0;
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
export const ErrorLabel = styled.label`
  color: red;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1.5px;
  line-height: 26px;
  text-align: left;
  display: block;
  margin: 0px;
  padding: 0px;
`;

export const Input = styled.input`
  border: solid 2px ${props => (props.error ? 'red' : '#5d5d5d')};
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
  &.upload {
    width: 320px;
  }
`;

export const FileInput = styled.input`
  border: solid 2px #5d5d5d;
  width: 370px;
  height: 36px;
  padding: 3px;
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
  &.upload {
    width: 320px;
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
  background: ${props => (props.disabled ? 'grey' : '#8c6239')}
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  width:fit-content;
  text-align:center;
  padding: 5px 10px;
  letter-spacing: 1px;
  display: block;
  margin-top: 10px;
  border: none;
  &.submit {
    position: relative;
    top: 60px;
    margin-top: 0;
  }
  &:hover {
    text-decoration:none;
    color:white;
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
  border: solid 2px ${props => (props.error ? 'red' : '#5d5d5d')};
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

export const DocTit = styled(Title)`
  font-size: 16px;
  line-height: 16px;
  margin: 10px 0;
  color: #333;
  margin-top: 25px;
`;

export const ProcessName = styled.div`
  color: #333;
  font-weight: 700;
  font-size: 23px;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

export const SubTit = styled.div`
  display: inline-block;
  color: #8c6239;
  font-size: 13px;
  letter-spacing: 1px;
  width: 130px;
  &.bold {
    color: #333;
    font-weight: 700;
  }
`;
export const Pad = styled.div`
  width: 700px;
  margin: 0 auto;
  padding: 20px 0;
`;
