import React, { useState, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortNumericDownAlt, faSortAlphaDown, faRedo, faBars } from '@fortawesome/free-solid-svg-icons';

export interface ICountData {
    id: string;
    displayName: string;
    count: number;
}

export interface IAreaPresentation {
    allAreaCounts?: Array<ICountData>;
    orderBy?: 'count' | 'name',
    fontSize?: string;
    fontColour?: string;
    fontFamily?:string;
    parentHeight: number;
    onSelect(countryId?: string):void;
}

const defaultValues = {
    open: false,
    orderBy: 'name',
    fontSize: '12px',
    fontFamily:'Arial',
    fontColour: '#444444'
};

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

const SortButton = styled(Button)`
    top: 0px;
`;

const OpenButton = styled(Button)`
    top: 0px;
    right: 10px;
`;

const ResetButton = styled(Button)`
    top: 0px;
    right: 45px;
`;

const sortButtonAnimationStyles = {
    open: {
        right: '80px',
        opacity: 1
    },
    closed: {
        right: '-30px',
        opacity: 0
    }
};

const List = styled(animated.div)`
    position: absolute;
    top: 35px;
    width: 278px;
    height: ${(props: IAreaPresentation) => props.parentHeight - 51}px;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: solid 1px #ddd;
    border-left: solid 1px #ddd;
    border-bottom: none;
    border-top-left-radius: 8px;
    background-color: rgba(255,255,255,0.8);
    padding: 5px;
    font-size: ${(props: IAreaPresentation) => props.fontColour || defaultValues.fontSize };
    font-family: ${(props: IAreaPresentation) => props.fontFamily || defaultValues.fontFamily };
    color: ${(props: IAreaPresentation) => props.fontColour || defaultValues.fontColour };
`;

const listAnimationStyles = {
    open: {
        right: '1px',
        opacity: 1
    },
    closed: {
        right: '-280px',
        opacity: 0
    }
};

const ListItem = styled(animated.div)`
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
    }

    .count {
        width: 30px;
        align-self: flex-end;
        text-align: right;
        margin-right: 5px;
    }
`;

const listItemAnimationStyles = {
    open: {
        right: '0px',
        opacity: 1
    },
    closed: {
        right: '-250px',
        opacity: 0
    }
};

const Container = styled(animated.div)`
    position: absolute;
    top: 10px;
    right:0;
    overflow: hidden;
`;

const containerAnimationStyles = {
    open: {
        width: '290px',
        height: '500px'
    },
    closed: {
        width: '75px',
        height: '30px'
    }
}

enum OrderBy {
    Count,
    Name
}


export const AreaList: React.FunctionComponent<IAreaPresentation> = (props) => {

    const { allAreaCounts, onSelect, parentHeight } = { ...defaultValues, ...props };

    const [isOpen, setIsOpen] = useState(false);
    const [orderBy, setOrderBy ] = useState(OrderBy.Count);

    const containerProps = useSpring(isOpen ? containerAnimationStyles.open : containerAnimationStyles.closed);
    const searchButtonProps = useSpring(isOpen ? sortButtonAnimationStyles.open : sortButtonAnimationStyles.closed);
    const listProps = useSpring(isOpen ? listAnimationStyles.open : listAnimationStyles.closed);
    const listItemProps = useSpring(isOpen ? listItemAnimationStyles.open : listItemAnimationStyles.closed);

    const listItems = useMemo(() => {
        if(allAreaCounts && allAreaCounts.length > 0) {
            return allAreaCounts.sort((a, b) => {

                if(orderBy === OrderBy.Count){
                    if(a.count > b.count) { return -1; }
                    if(a.count < b.count) { return 1; }
        
                    if(a.count === b.count) {
                        if(a.displayName < b.displayName) { return -1; }
                        if(a.displayName > b.displayName) { return 1; }
                        return 0;
                    }
                }
                else if(orderBy === OrderBy.Name){
                    if(a.displayName < b.displayName) { return -1; }
                    if(a.displayName > b.displayName) { return 1; }
                }
                
                return 0;
            });
        }
        return [];
    }, [allAreaCounts, orderBy]);

    return (
        <Container style={containerProps}>
            <SortButton title={`Order by ${orderBy === OrderBy.Count ? 'name' : 'count'}`} style={searchButtonProps} onClick={() => setOrderBy(orderBy === OrderBy.Count ? OrderBy.Name : OrderBy.Count)}>
                <FontAwesomeIcon icon={orderBy === OrderBy.Count ? faSortNumericDownAlt : faSortAlphaDown}></FontAwesomeIcon>
            </SortButton>
            <OpenButton title={`${isOpen ? 'Close' : 'Open'} list`} onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
            </OpenButton>
            <ResetButton title={'Reset Map'} onClick={() => onSelect(undefined)}>
                <FontAwesomeIcon icon={faRedo}></FontAwesomeIcon>
            </ResetButton>
            <List style={listProps} parentHeight={parentHeight}>
                {
                    listItems.map(value => (
                        <ListItem key={value.id} style={listItemProps} onClick={() => onSelect(value.id)}>
                            <div className="name">{value.displayName}</div>
                            <div className="count">{value.count}</div>
                        </ListItem>
                    ))
                }
            </List>
        </Container>
    );
}