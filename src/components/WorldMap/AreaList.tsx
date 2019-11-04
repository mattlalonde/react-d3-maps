import React, { useState } from 'react';
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
    onSelect(countryId?: string):void;
}

const defaultValues = {
    open: false,
    orderBy: 'name',
    fontSize: '12px',
    fontColour: '#444444'
};

const SearchButton = styled(animated.button)`
    position: absolute;
    top: 0px;
    width: 30px;
    height: 30px;
`;

const searchButtonAnimationStyles = {
    open: {
        right: '80px',
        opacity: 1
    },
    closed: {
        right: '-30px',
        opacity: 0
    }
};

const SearchInput = styled(animated.input)`
    position: absolute;
    top: 0px;
    width: 168px;
    height: 24px;
`;

const searchInputAnimationStyles = {
    open: {
        right: '115px',
        opacity: 1
    },
    closed: {
        right: '-200px',
        opacity: 0
    }
};

const List = styled(animated.div)`
    position: absolute;
    top: 35px;
    width: 278px;
    height: 400px;
    overflow-y: auto;
    border-top: solid 1px #ddd;
    border-left: solid 1px #ddd;
    border-bottom: solid 1px #ddd;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background-color: rgba(255,255,255,0.7);
    padding: 5px;
    font-size: ${(props: IAreaPresentation) => props.fontColour || defaultValues.fontSize };
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

    const { allAreaCounts, onSelect } = { ...defaultValues, ...props };

    const [isOpen, setIsOpen] = useState(false);
    const [orderBy, setOrderBy ] = useState(OrderBy.Count);

    const containerProps = useSpring(isOpen ? containerAnimationStyles.open : containerAnimationStyles.closed);
    const searchButtonProps = useSpring(isOpen ? searchButtonAnimationStyles.open : searchButtonAnimationStyles.closed);
    const searchInputProps = useSpring(isOpen ? searchInputAnimationStyles.open : searchInputAnimationStyles.closed);
    const listProps = useSpring(isOpen ? listAnimationStyles.open : listAnimationStyles.closed);
    const listItemProps = useSpring(isOpen ? listItemAnimationStyles.open : listItemAnimationStyles.closed);

    const listItems = [];
    allAreaCounts.sort((a, b) => {

        if(orderBy === OrderBy.Count){
            if(a.count > b.count) { return -1; }
            if(a.count < b.count) { return 1; }

            if(a.count == b.count) {
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
    }).forEach((value, key) => {
        listItems.push(
            <ListItem key={value.id} style={listItemProps} onClick={() => onSelect(value.id)}>
                <div className="name">{value.displayName}</div>
                <div className="count">{value.count}</div>
            </ListItem>
        );
    });

    return (
        <Container style={containerProps}>
            <SearchButton title={`Order by ${orderBy === OrderBy.Count ? 'name' : 'count'}`} style={searchButtonProps} onClick={() => setOrderBy(orderBy === OrderBy.Count ? OrderBy.Name : OrderBy.Count)}>
                <FontAwesomeIcon icon={orderBy == OrderBy.Count ? faSortNumericDownAlt : faSortAlphaDown}></FontAwesomeIcon>
            </SearchButton>
            <SearchInput type={'text'} style={searchInputProps}></SearchInput>
            <button title={`${isOpen ? 'Close' : 'Open'} list`} style={{ position: 'absolute', top: 0, right: 10, width: '30px', height: '30px' }} onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
            </button>
            <button title={'Reset Map'} style={{ position: 'absolute', top: 0, right: 45, width: '30px', height: '30px' }} onClick={() => onSelect(undefined)}>
                <FontAwesomeIcon icon={faRedo}></FontAwesomeIcon>
            </button>
            
            <List style={listProps}>
                {
                    
                    listItems
                }
            </List>
        </Container>
    );
}