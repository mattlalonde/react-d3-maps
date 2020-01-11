import styled from 'styled-components';
import { animated } from 'react-spring';

const Button = styled(animated.button)`
    position: absolute;
    width: 30px;
    height: 30px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    margin:0;
    padding:0;
    border-radius: 4px;
    background-colour: #ffffff;
    border-color: #dddddd;
    cursor: pointer;

    &:focus {
        outline: 0;
    }

    &:hover {
        background-color: #f8f8f8;
        border-color: #aaaaaa;
    }
`;

export const SortButton = styled(Button)`
    top: 0px;
`;

export const OpenButton = styled(Button)`
    top: 0px;
    right: 10px;
`;

export const ResetButton = styled(Button)`
    top: 0px;
    right: 45px;
`;

export const List = styled(animated.div)`
    position: absolute;
    top: 35px;
    width: 230px;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: solid 1px #ddd;
    border-left: solid 1px #ddd;
    border-bottom: none;
    border-top-left-radius: 8px;
    background-color: rgba(255,255,255,0.8);
    padding: 5px;
`;

export const ListItem = styled(animated.div)`
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
    padding: 5px 0;
    cursor: pointer;

    &:hover {
        background-color: #eeeeee;
    }

    .name {
        flex-grow: 1;
        padding: 0 5px;
        text-align: left;
        margin-left: 5px;
    }

    .count {
        width: 30px;
        align-self: flex-end;
        text-align: right;
        margin-right: 5px;
    }
`;

export const Container = styled(animated.div)`
    position: absolute;
    top: 10px;
    right:0;
    overflow: hidden;
`;