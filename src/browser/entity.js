import entity from './entity.html'
import Address from './address.js'

export default class Entity extends Address {
  constructor (dispatcher, data, index, currency) {
    super(dispatcher, data, index, currency)
    this.template = entity
    this.options =
      [
        {icon: 'sign-in-alt', optionText: 'Incoming neighbors', message: 'initIndegreeTable'},
        {icon: 'sign-out-alt', optionText: 'Outgoing neighbors', message: 'initOutdegreeTable'},
        {icon: 'at', optionText: 'Addresses', message: 'initAddressesTable'},
        {icon: 'tags', optionText: 'Tags', message: 'initTagsTable'}
      ]
  }
}