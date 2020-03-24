const { Config } = require('./lib/config')
const { Gantree } = require('./lib/gantree')

const config = new Config()
const cfg = config.read(process.env.GANTREE_CONFIG_PATH)

const gantree = new Gantree()
gantree.cleanAll(cfg)
