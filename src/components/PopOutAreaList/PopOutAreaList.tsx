import React, { useState, useMemo } from 'react';
import { useSpring } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortNumericDownAlt, faSortAlphaDown, faRedo, faBars } from '@fortawesome/free-solid-svg-icons';
import {SortButton, OpenButton, ResetButton, Container, List, ListItem } from './PopOutAreaListStyles';

export interface ICountData {
    id: string;
    displayName: string;
    count: number;
}

export interface IPopOutAreaListProps {
    allAreaCounts?: Array<ICountData>;
    orderBy?: 'count' | 'name',
    fontSize?: number;
    fontColour?: string;
    fontFamily?:string;
    parentHeight: number;
    onSelect?:(countryId?: string) => void;
}

const defaultValues = {
    open: false,
    orderBy: 'name',
    fontSize: 12,
    fontFamily:'Arial',
    fontColour: '#444444',
    onSelect: (countryId?: string) => {}
};

const sortButtonAnimationStyles = {
    open: { right: '80px', opacity: 1 },
    closed: { right: '-30px', opacity: 0 }
};

const listAnimationStyles = {
    open: { right: '1px', opacity: 1 },
    closed: { right: '-280px', opacity: 0 }
};

const listItemAnimationStyles = {
    open: { right: '0px', opacity: 1 },
    closed: { right: '-250px', opacity: 0 }
};

const containerAnimationStyles = {
    open: { width: '290px', height: '500px' },
    closed: { width: '75px', height: '30px' }
}

enum OrderBy {
    Count,
    Name
}


export const PopOutAreaList: React.FunctionComponent<IPopOutAreaListProps> = (props) => {

    const { allAreaCounts, onSelect, parentHeight, fontColour, fontFamily, fontSize } = { ...defaultValues, ...props };

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
            <List style={{ ...{height: parentHeight - 51, fontFamily: fontFamily, colour: fontColour, fontSize: `${fontSize}px`}, ...listProps }}>
                {
                    listItems.map((value, index) => (
                        <ListItem key={index} style={listItemProps} onClick={() => onSelect(value.id)}>
                            <div className="name">{value.displayName}</div>
                            <div className="count">{value.count}</div>
                        </ListItem>
                    ))
                }
            </List>
        </Container>
    );
}