import React from 'react'
import { GridRow, GridColumn } from 'semantic-ui-react'

const TableComponent = ({ h, sh}) => {
    return <GridRow textAlign='left' className='r-adj'>
    <GridColumn width={8}>
       <b>{h}</b>
    </GridColumn>
    <GridColumn width={8}>
       {sh}
    </GridColumn>
    </GridRow>
}

export default TableComponent