import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import { Calendar } from 'primereact/calendar'
import { SERVER } from '../config/global'
import people from './people.png'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

import { getParents, addParent, saveParent, deleteParent, deleteKid, saveKid } from '../actions'

const parentSelector = state => state.parent.parentList
const parentCountSelector = state => state.parent.count

function ParentList() {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const [name, setname] = useState('')
  const [date, setdate] = useState('')
  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedParent, setSelectedParent] = useState(null)
  const [filterString, setFilterString] = useState('')
  const [kids, setKid] = useState([]);

  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState(0)

  const handleFilter = (evt) => {
    const oldFilters = filters
    oldFilters[evt.field] = evt.constraints.constraints[0]
    setFilters({ ...oldFilters })
  }

  const handleFilterClear = (evt) => {
    setFilters({
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      date: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
  }

  useEffect(() => {
    const keys = Object.keys(filters)
    const computedFilterString = keys.map(e => {
      return {
        key: e,
        value: filters[e].value
      }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
    setFilterString(computedFilterString)
  }, [filters])

  const parents = useSelector(parentSelector)
  const count = useSelector(parentCountSelector)


  const loadKids = async (id) => {
    const response = await fetch(`${SERVER}/api/companies/${id}/founders`)
    if (response.status === 200) {
      setKid(await response.json());
    }

  }
  useEffect(() => loadKids(), []);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getParents(filterString, page, 2, sortField, sortOrder))
  }, [filterString, page, sortField, sortOrder])

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setname('')
    setdate('')
  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    if (isNewRecord) {
      dispatch(addParent({ name, date }))
    } else {
      dispatch(saveParent(selectedParent, { name, date }))
    }
    setIsDialogShown(false)
    setSelectedParent(null)
    setname('')
    setdate('')
  }

  const editParent = (rowData) => {
    setSelectedParent(rowData.id)
    setname(rowData.name)
    setdate(rowData.date)
    setIsDialogShown(true)
    setIsNewRecord(false)
  }

  const handleDeleteParent = (rowData) => {
    dispatch(deleteParent(rowData.id))
  }

  const handleDeleteKid = (rowData) => {
    dispatch(deleteKid(rowData.companyId, rowData.id))
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
    </div>
  )

  const dialogFooter = (
    <div>
      <Button label='Save' icon='pi pi-save' onClick={handleSaveClick} />
    </div>
  )


  const ShowKids = (rowData) => {
    loadKids(rowData.id)

  }


  const opsColumn = (rowData) => {
    return (
      <>
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editParent(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteParent(rowData)} />
        <Button label='Founders' onClick={() => ShowKids(rowData)} />
      </>
    )
  }

  const opsColumn2 = (rowData) => {
    return (
      <>
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteKid(rowData)} />
      </>
    )
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 2)
  }

  const handleSort = (evt) => {
    console.warn(evt)
    setSortField(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  return (
    <div>
      <DataTable
        value={parents}
        footer={tableFooter}
        lazy
        paginator
        onPage={handlePageChange}
        first={first}
        rows={2}
        totalRecords={count}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column header='Name' field='name' filter filterField='name' filterPlaceholder='filter by name' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column header='Date' field='date' filter filterField='date' filterPlaceholder='filter by date' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='Company' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='name' onChange={(evt) => setname(evt.target.value)} value={name} />
        </div>
        <div>
          <Calendar placeholder={date} value={date} onChange={(evt) => setdate(evt.target.value)} value={date}></Calendar>
        </div>
      </Dialog>
      <div>
        <div className='cv2'>
          <h1>Founders</h1>
          <img id="i2" alt="cv2" src={people}></img>
        </div>
        <DataTable
          value={kids}
          lazy
        >
          <Column header='Name' field='name' />
          <Column header='Role' field='rol' />
          <Column body={opsColumn2} />
        </DataTable>
      </div>
    </div>
  )
}

export default ParentList