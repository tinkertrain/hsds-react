// Should be a .ts file
// Couldn't figure out how to make this play nicely with Jest.
import createStore from 'unistore'
import { noop } from '../../../utilities/other'

export const initialState = {
  activeItem: null,
  activeIndex: '',
  closeOnSelect: true,
  items: [],
  isOpen: false,
  direction: 'right',
  dropUp: false,
  onOpen: noop,
  onClose: noop,
  onSelect: noop,
}

const store = createStore(initialState)

export default store
