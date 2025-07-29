import React from 'react'
import { ListItem, ListContent, ListHeader, ListDescription, Icon } from 'semantic-ui-react'

const ListComponent = ({ i, h, sh}) => {
    return <ListItem>
        {i ? <Icon name={i} color='red'/> : <></>}
        <ListContent>
            <ListHeader>{h}</ListHeader>
            <ListDescription>{sh}</ListDescription>
        </ListContent>
    </ListItem>
}

export default ListComponent