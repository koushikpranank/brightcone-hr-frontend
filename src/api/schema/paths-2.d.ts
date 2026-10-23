import type { operations } from '../schema'

export interface PathGroup2 {
  '/api/notifications': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['list']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/notifications/{id}/read': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['mark_read']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/departments': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['departments']
    put?: never
    post: operations['create_department']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/departments/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put: operations['department']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/departments/{id}/archive': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['archive_department']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/departments/{id}/restore': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['restore_department']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/employees': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['list_employees']
    put?: never
    post: operations['create_employee']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/employees/import/dry-run': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['dry_run']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/employees/import/template.csv': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['template']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/employees/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put: operations['update']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/employees/{id}/archive': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['archive']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/employees/{id}/restore': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['restore']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/grades': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['grades']
    put?: never
    post: operations['create_grade']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/grades/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put: operations['grade']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/grades/{id}/archive': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['archive_grade']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/grades/{id}/restore': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post: operations['restore_grade']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/people/locations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['locations']
    put?: never
    post: operations['create_location']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
