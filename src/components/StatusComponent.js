import React from 'react'
import { Header, HeaderSubheader } from 'semantic-ui-react'

const StatusComponent = ({ h, sh}) => {
    return  <Header as='h2'>
    {h}
    <HeaderSubheader>
    {sh}
    </HeaderSubheader>
    </Header>
}

export default StatusComponent