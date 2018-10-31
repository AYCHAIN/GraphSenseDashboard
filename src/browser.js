import layout from './browser/layout.html'
import Address from './browser/address.js'
import Cluster from './browser/cluster.js'
import Search from './browser/search.js'
import TransactionsTable from './browser/transactions_table.js'

export default class Browser {
  constructor (dispatcher, store) {
    this.store = store
    this.dispatcher = dispatcher
    this.dispatcher.on('searchresult.browser', (result) => {
      this.searchresult(result)
    })
    this.dispatcher.on('selectNode.browser', ([type, nodeId]) => {
      if (type === 'address') {
        this.address(nodeId[0])
      } else if (type === 'cluster') {
        this.cluster(nodeId[0])
      }
      this.render()
    })
    this.dispatcher.on('resultNode.browser', (response) => {
      if (!(this.content[0] instanceof Search)) return
      if (!this.content[0].loading.has(response.result.address)) return
      this.content[0].loading.remove(response.result.address)
      let a = this.store.add(response.result)
      this.content = this.content.slice(0, 1)
      this.content[1] = new Address(this.dispatcher, a)
      this.render()
    })

    this.dispatcher.on('initTransactionsTable.browser', (request) => {
      let last = this.content[this.content.length - 1]
      if (!(last instanceof Address)) return
      let total = last.data.noIncomingTxs + last.data.noOutgoingTxs
      this.content.push(new TransactionsTable(this.dispatcher, request.id, request.type, total))
      this.render()
    })

    this.root = document.createElement('div')
    this.root.className = 'h-full'
    this.search()
  }
  search () {
    this.activeTab = 'search'

    this.content = [ new Search(this.dispatcher) ]
  }
  address (addr) {
    let address = this.store.get('address', addr)
    if (!address) {
      console.error(`browser: ${addr} not found`)
      return
    }
    this.activeTab = 'address'
    this.content = [ new Address(this.dispatcher, address) ]
  }
  cluster (cluster) {
    cluster = this.store.get('cluster', cluster)
    if (!cluster) {
      console.error(`browser: ${cluster} not found`)
      return
    }
    this.activeTab = 'address'
    this.content = [ new Cluster(this.dispatcher, cluster) ]
  }
  searchresult (result) {
    if (this.activeTab !== 'search') return
    console.log('searchresult', result)
    // assume search being the first in content
    let search = this.content[0]
    search.setResult(result)
    search.render()
  }
  pickresult (result) {
    if (this.activeTab !== 'search') return
    // assume search being the first in content
    let content = [this.content[0]]
    let comp = null
    if (result.address) {
      this.store.add(result)

      comp = new Address(this.dispatcher, result)
    }
    if (comp === null) return
    content.push(comp)
    this.content = content
  }
  render () {
    this.root.innerHTML = layout
    this.root.querySelector('#browser-nav-search-button')
      .addEventListener('click', () => {
        this.search()
        this.render()
      })
    let data = this.root.querySelector('#browser-data')
    let c = 0
    this.content.forEach((comp) => {
      c += 1
      data.appendChild(comp.render())
      let options = comp.renderOptions()
      if (!options) return
      let el = document.createElement('div')
      el.className = 'h-full mx-2 my-1 ' + (c < this.content.length ? 'browser-options-short' : '')
      el.appendChild(options)
      data.appendChild(el)
    })
    return this.root
  }
}