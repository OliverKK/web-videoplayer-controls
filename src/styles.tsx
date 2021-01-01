import styled from 'styled-components';

const themeRedBright = '#ff8282';
const themeRedDark = '#ff4e4e';

export const VideoWrapper = styled.div`
  margin: 1.5em;

  &:hover {
    cursor: pointer;
  }
`;

export const Video = styled.video``;

export const ProgressBar = styled.div`
border-radius: 2px;
  background-color: #cdcdcd;
  height: 5px;
  margin-top: 8px;
  width: 100%;
  cursor: pointer;
  transition: border 0.01s linear;
`;

export const ProgressBarWrapper = styled.div`
  display: flex;
  width: calc(100% - 0.5em);
  height: 20px;
  margin: 0.5em auto;
  border-radius: 0.5em;
  cursor: pointer;
`;

export const Dot = styled.span`
  height: 20px;
  width: 20px;
  position: absolute;
  background-color: ${themeRedBright};
  border-radius: 50%;
  margin-left: -5px;
  transition: transform 0.01s linear;

  &:hover {
    background-color: ${themeRedDark};
    cursor: pointer;
  }
`;

export const Button = styled.button`
    cursor: pointer;
    margin-top: auto;
    margin-right: 0.5em;
    color: #fff;
    background-color: ${themeRedBright};
    border-color: ${themeRedBright};
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.575rem 0.75rem 0.175rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:hover {
        color: #fff;
        background-color: ${themeRedDark};
        border-color: ${themeRedDark};
    }
`;