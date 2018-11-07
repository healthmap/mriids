import styled from 'styled-components'

const OnOffSwitch = styled.div`
  position: relative;
  width: 50px;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select: none;

  input[type=checkbox] {
    display: none;
    &:checked + label .onoffswitch-inner {
      margin-left: 0;
    }
    &:checked + label .onoffswitch-switch {
      margin-right: 0;
      right: 0px;
    }
  }

  label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border-radius: 20px;
    border: 1px solid #ececec;
  }

  .onoffswitch-inner {
    display: block;
    width: 200%;
    margin-left: -100%;
    transition: margin 0.3s ease-in 0s;
    &:before, &:after {
      display: block;
      float: left;
      width: 50%;
      height: 15px;
      padding: 0;
      line-height: 15px;
      font-size: 10px;
      font-weight: bold;
      color: #333;
      background-color: #fff;
      box-sizing: border-box;
    }
    &:before {
      content: "ON";
      padding-left: 8px;
    }
    &:after {
      content: "OFF";
      padding-right: 8px;
      text-align: right;
    }
  }

  .onoffswitch-switch {
    display: block;
    width: 16px;
    height: 16px;
    margin: 0;
    background: #666;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 35px;
    border-radius: 50%;
    transition: all 0.3s ease-in 0s;
  }

`

export default OnOffSwitch;
