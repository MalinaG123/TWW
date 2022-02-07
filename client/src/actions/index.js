import { SERVER } from '../config/global'

export const getParents = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_PARENTS',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/companies?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addParent = (parent, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'ADD_PARENT',
    payload: async () => {
      let response = await fetch(`${SERVER}/api/companies`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parent)
      })
      response = await fetch(`${SERVER}/api/companies?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const saveParent = (id, parent, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'SAVE_PARENT',
    payload: async () => {
      let response = await fetch(`${SERVER}/api/companies/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parent)
      })
      response = await fetch(`${SERVER}/api/companies?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteParent = (id, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'DELETE_PARENT',
    payload: async () => {
      let response = await fetch(`${SERVER}/api/companies/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/api/companies?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}


export const addKid = (kid, id) => {
  return {
    type: 'ADD_KID',
    payload: async () => {
      let response = await fetch(`${SERVER}/api/companies/${id}/founders`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kid)
      })
      response = await fetch(`${SERVER}/api/companies/${id}/founders`)
      const data = await response.json()
      return data
    }
  }
}

export const saveKid = (id, kid, idparent) => {
  return {
    type: 'SAVE_KID',
    payload: async () => {
      let response = await fetch(`${SERVER}/api/companies/${idparent}/founders/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kid)
      })
      response = await fetch(`${SERVER}/api/companies/${idparent}/founders`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteKid = (idparent, id) => {
  return {
    type: 'DELETE_KID',
    payload: async () => {
      let response = await fetch(`${SERVER}/api/companies/${idparent}/founders/${id}`, {
        method: 'delete'
      })
      // response = await fetch(`${SERVER}/api/companies/${idparent}/founders`)
      // const data = await response.json()
      // return data
    }
  }
}

