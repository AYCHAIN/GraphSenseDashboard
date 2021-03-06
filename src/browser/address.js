import address from './address.html'
import moment from 'moment'
import {replace} from '../template_utils'
import BrowserComponent from './component.js'
import incomingNeighbors from '../icons/incomingNeighbors.html'
import outgoingNeighbors from '../icons/outgoingNeighbors.html'

export default class Address extends BrowserComponent {
  constructor (dispatcher, data, index, currency) {
    super(dispatcher, index, currency)
    this.data = data
    this.template = address
    this.options =
      [
        {html: incomingNeighbors, optionText: 'Incoming neighbors', message: 'initIndegreeTable'},
        {html: outgoingNeighbors, optionText: 'Outgoing neighbors', message: 'initOutdegreeTable'},
        {icon: 'exchange-alt', optionText: 'Transactions', message: 'initTransactionsTable'},
        {icon: 'tags', optionText: 'Tags', message: 'initTagsTable'}
      ]
  }
  render (root) {
    if (root) this.root = root
    if (!this.root) throw new Error('root not defined')
    super.render()
    let first = this.data.first_tx.timestamp
    let last = this.data.last_tx.timestamp
    let duration = (last - first) * 1000
    let flat = {
      first_usage: this.formatTimestampWithAgo(first),
      last_usage: this.formatTimestampWithAgo(last),
      activity_period: moment.duration(duration).humanize(),
      total_received: this.formatCurrency(this.data.total_received[this.currency], this.data.keyspace),
      balance: this.formatCurrency(this.data.balance[this.currency], this.data.keyspace),
      keyspace: this.data.keyspace.toUpperCase()
    }
    this.root.innerHTML = replace(this.template, {...this.data, ...flat})
    return this.root
  }
  requestData () {
    return {...super.requestData(), id: this.data.id, type: this.data.type}
  }
}
