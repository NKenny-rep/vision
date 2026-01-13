import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Pagination from './Pagination.vue'

describe('UI/Pagination', () => {
  it('should render with current and total pages', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 10
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display result info', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 2,
        totalPages: 10,
        totalResults: 100,
        pageSize: 10,
        showInfo: true
      }
    })

    expect(wrapper.text()).toContain('11')
    expect(wrapper.text()).toContain('20')
    expect(wrapper.text()).toContain('100')
  })

  it('should calculate correct start and end items', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 3,
        totalPages: 10,
        totalResults: 95,
        pageSize: 10
      }
    })

    expect(wrapper.vm.startItem).toBe(21)
    expect(wrapper.vm.endItem).toBe(30)
  })

  it('should emit page-change event on previous button click', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 5,
        totalPages: 10
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'UIButton' })
    await buttons[0].vm.$emit('click')

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([4])
  })

  it('should emit page-change event on next button click', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 5,
        totalPages: 10
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'UIButton' })
    await buttons[1].vm.$emit('click')

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([6])
  })

  it('should disable previous button on first page', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 10
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'UIButton' })
    expect(buttons[0].props('disabled')).toBe(true)
  })

  it('should disable next button on last page', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 10,
        totalPages: 10
      }
    })

    const buttons = wrapper.findAllComponents({ name: 'UIButton' })
    expect(buttons[1].props('disabled')).toBe(true)
  })

  it('should hide info when showInfo is false', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 10,
        totalResults: 100,
        showInfo: false
      }
    })

    expect(wrapper.text()).not.toContain('100')
  })

  it('should handle last page with partial results', async () => {
    const wrapper = await mountSuspended(Pagination, {
      props: {
        currentPage: 10,
        totalPages: 10,
        totalResults: 95,
        pageSize: 10
      }
    })

    expect(wrapper.vm.startItem).toBe(91)
    expect(wrapper.vm.endItem).toBe(95)
  })
})
