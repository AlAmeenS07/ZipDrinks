import NodeCache from 'node-cache'

const cache = new NodeCache({stdTTL : 900})

export default cache