import React, { PureComponent as Component } from 'react'
import { mount } from 'enzyme'
import InfiniteScroller from '..'
import LoadingDots from '../../LoadingDots'
import { default as Modal, ModalComponent } from '../../Modal/Modal'
import Text from '../../Text'

const scrollEvent = new Event('scroll')

describe('ClassName', () => {
  test('Has default className', () => {
    const wrapper = mount(<InfiniteScroller />)

    expect(wrapper.hasClass('c-InfiniteScroller')).toBeTruthy()
  })

  test('Applies custom className if specified', () => {
    const customClass = 'piano-key-neck-tie'
    const wrapper = mount(<InfiniteScroller className={customClass} />)

    expect(wrapper.prop('className')).toContain(customClass)
  })
})

describe('isMounted', () => {
  test('Sets internal isMounted on mount', () => {
    const wrapper = mount(<InfiniteScroller />)
    const o = wrapper.instance()

    expect(o._isMounted).toBeTruthy()
  })

  test('Sets internal isMounted to false on unmount', () => {
    const wrapper = mount(<InfiniteScroller />)
    const o = wrapper.instance()
    wrapper.unmount()

    expect(o._isMounted).not.toBeTruthy()
  })
})

describe('Node Scope', () => {
  test('Auto sets the node scope to parent node by default', () => {
    const wrapper = mount(
      <div className="derlict">
        <InfiniteScroller />
      </div>
    )
    const o = wrapper.find(InfiniteScroller).getNode()
    const d = wrapper.find('.derlict').getNode()

    expect(o.state.nodeScope).toBe(d)
  })
})

describe('scrollParent', () => {
  test('Undefined scrollParent will default to parentnode', () => {
    const wrapper = mount(
      <div className="derlict">
        <InfiniteScroller />
      </div>
    )
    const o = wrapper.find(InfiniteScroller).getNode()
    const d = wrapper.find('.derlict').getNode()

    expect(o.state.nodeScope).toBe(d)
  })

  test('A node element scrollParent can be defined', () => {
    const node = document.createElement('div')
    node.id = 'hansel'

    const wrapper = mount(
      <div className="derlict">
        <InfiniteScroller scrollParent={node} />
      </div>
    )
    const o = wrapper.find(InfiniteScroller).getNode()

    expect(o.state.nodeScope).toBe(node)
    expect(o.state.nodeScope.id).toBe('hansel')
  })

  test('getScrollParent can retrieve a DOM node', () => {
    class CustomModal extends Component {
      getScrollParent() {
        return this.node
      }
      render() {
        const getScrollParent = this.getScrollParent.bind(this)
        return (
          <ModalComponent>
            <Modal.Body>
              <div className="outer">
                <div
                  className="custom-scroller"
                  ref={node => {
                    this.node = node
                  }}
                />
                <InfiniteScroller
                  onLoading={spy}
                  getScrollParent={getScrollParent}
                />
              </div>
            </Modal.Body>
          </ModalComponent>
        )
      }
    }
    const spy = jest.fn()
    const wrapper = mount(<CustomModal />)

    const o = wrapper.find('.custom-scroller')
    const n = wrapper.find(InfiniteScroller).getNode()

    o.getNode().dispatchEvent(scrollEvent)

    expect(n.state.nodeScope).toBe(o.node)
    expect(spy).toHaveBeenCalled()
  })

  test('getScrollParent falls back to direct parentNode if falsy', () => {
    class CustomModal extends Component {
      getScrollParent() {
        return false
      }
      render() {
        const getScrollParent = this.getScrollParent.bind(this)
        return (
          <ModalComponent>
            <Modal.Body>
              <div className="outer">
                <div
                  className="custom-scroller"
                  ref={node => {
                    this.node = node
                  }}
                />
                <InfiniteScroller
                  onLoading={spy}
                  getScrollParent={getScrollParent}
                />
              </div>
            </Modal.Body>
          </ModalComponent>
        )
      }
    }
    const spy = jest.fn()
    const wrapper = mount(<CustomModal />)

    const o = wrapper.find('.outer')
    const n = wrapper.find(InfiniteScroller).getNode()

    o.getNode().dispatchEvent(scrollEvent)

    expect(n.state.nodeScope).toBe(o.node)
    expect(spy).toHaveBeenCalled()
  })
})

describe('Loading', () => {
  test('Adds isLoading className', () => {
    const wrapper = mount(<InfiniteScroller isLoading />)

    expect(wrapper.hasClass('is-loading')).toBeTruthy()
  })

  test('Renders LoadingDots by default when isLoading', () => {
    const wrapper = mount(<InfiniteScroller isLoading />)
    const o = wrapper.find(LoadingDots)

    expect(o.length).toBe(1)
    expect(o.getNode().props.align).toBe('center')
  })

  test('Can render custom loading markup', () => {
    const wrapper = mount(
      <InfiniteScroller isLoading loading={<Text>Derlict</Text>} />
    )
    const o = wrapper.find(LoadingDots)
    const n = wrapper.find(Text)

    expect(o.length).toBe(0)
    expect(n.length).toBe(1)
  })

  test('Can change isLoading state by prop change', () => {
    const wrapper = mount(<InfiniteScroller />)

    expect(wrapper.state().isLoading).not.toBeTruthy()
    wrapper.setProps({ isLoading: true })
    expect(wrapper.state().isLoading).toBeTruthy()
  })
})

describe('Callbacks', () => {
  test('onLoading callback can be fired when triggered', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller onLoading={spy} isLoading />)
    const o = wrapper.instance()

    o.handleOnLoading()

    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().isLoading).toBeTruthy()
  })

  test('onLoading callback can still be fired when triggered when mounted', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller onLoading={spy} />)
    const o = wrapper.instance()

    wrapper.unmount()

    o.handleOnLoading()

    expect(spy).toHaveBeenCalled()
  })

  test('onLoading callback can fire onLoaded callback', done => {
    const spy = jest.fn()
    const onLoading = onLoaded => {
      spy()
      onLoaded()
    }
    const wrapper = mount(<InfiniteScroller onLoading={onLoading} isLoading />)
    const o = wrapper.instance()

    o.handleOnLoading()

    setTimeout(() => {
      expect(spy).toHaveBeenCalled()
      expect(wrapper.state().isLoading).not.toBeTruthy()
      done()
    }, 0)
  })

  test('Does not fire onLoading callback when isLoading is set', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller isLoading onLoading={spy} />)
    const o = wrapper.instance()

    o.handleOnScroll()

    expect(spy).not.toHaveBeenCalled()
  })

  test('onLoaded callback can be fired when triggered', done => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller onLoaded={spy} isLoading />)
    const o = wrapper.instance()

    o.handleOnLoading()

    expect(spy).not.toHaveBeenCalled()
    expect(wrapper.state().isLoading).toBeTruthy()

    o.handleOnLoaded()

    setTimeout(() => {
      expect(spy).toHaveBeenCalled()
      expect(wrapper.state().isLoading).not.toBeTruthy()
      done()
    }, 0)
  })

  test('onLoaded callback can still be fired when triggered when mounted', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller onLoaded={spy} />)
    const o = wrapper.instance()

    wrapper.unmount()
    o.handleOnLoaded()

    expect(spy).toHaveBeenCalled()
  })

  test('onLoading callback can be triggered when isLoading prop changes to truthy ', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller onLoading={spy} />)

    wrapper.setProps({ isLoading: true })

    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().isLoading).toBeTruthy()
  })

  test('onLoaded callback cannot be triggered when already loading', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller isLoading />)

    wrapper.setProps({ onLoading: spy })
    wrapper.setProps({ isLoading: true })

    expect(spy).not.toHaveBeenCalled()
    expect(wrapper.state().isLoading).toBeTruthy()
  })

  test('onLoaded callback can be triggered when isLoading prop changes from true to false', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller onLoaded={spy} isLoading />)

    wrapper.setProps({ isLoading: false })

    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().isLoading).not.toBeTruthy()
  })

  test('onLoading callback cannot be triggered when already loaded', () => {
    const spy = jest.fn()
    const wrapper = mount(<InfiniteScroller />)

    wrapper.setProps({ onLoaded: spy })
    wrapper.setProps({ isLoading: false })

    expect(spy).not.toHaveBeenCalled()
    expect(wrapper.state().isLoading).not.toBeTruthy()
  })
})

describe('Integration: Modal', () => {
  test('Can work with Modal', () => {
    const spy = jest.fn()
    const wrapper = mount(
      <ModalComponent>
        <Modal.Body>
          <InfiniteScroller onLoading={spy} />
        </Modal.Body>
      </ModalComponent>
    )
    const o = wrapper.find('.c-Scrollable__content')

    o.getNode().dispatchEvent(scrollEvent)

    expect(spy).toHaveBeenCalled()
  })
})
