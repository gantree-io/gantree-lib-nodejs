const path = require('path')
const fs = require('fs-extra')

const cmd = require('../cmd')
const { Project } = require('../project')
const tpl = require('../tpl')
const { nodeExporterUsername, nodeExporterPassword } = require('../env')
const { returnLogger } = require('../logging')

const logger = returnLogger('ansible')

const inventoryFileName = 'inventory'

class Ansible {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg))

    // todo: not maintainable, replace any of these paths with a package-wide variable
    this.ansiblePath = path.join(__dirname, '..', '..', '..', 'ansible')
    this.options = {
      cwd: this.ansiblePath,
      verbose: true
    }
  }

  async sync() {
    const inventoryPath = this._writeInventory()
    //return this._cmd(`all -b -m ping -i ${inventoryFileName}`, this.options); // ping everything in inventory
    //return this._cmd(`main.yml -vvvv -f 30 -i ${inventoryPath}`); // run main.yml verbosely
    return this._cmd(`main.yml -f 30 -i "${inventoryPath}"`)
  }

  async clean() {}

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options)
    return cmd.exec(`ansible-playbook ${command}`, actualOptions)
  }

  _writeInventory() {
    // todo: not maintainable, replace any of these paths with a package-wide variable
    const origin = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tpl',
      'ansible_inventory'
    )
    const project = new Project(this.config)
    const buildDir = path.join(project.path(), 'ansible')
    fs.ensureDirSync(buildDir, { recursive: true })
    const target = path.join(buildDir, inventoryFileName)
    const validators = this._genTplNodes(this.config.validators)
    // const publicNodes = this._genTplNodes(this.config.publicNodes, validators.length);
    const bootnodes = this._arrayify(this.config.validators.bootnodes)
    const substrateOptions = this._arrayify(
      this.config.validators.substrateOptions
    )
    //todo: references to this should be .repoVersion not .version
    const version = this._getVersion(this.config.binary.version)
    // console.log({ origin, project, buildDir, target, validators, bootnodes, version })
    logger.info(`Preparing nodes with version ${version}`)

    const data = {
      project: this.config.project,

      substrateRepository: this.config.binary.url || false,
      substrateBinary: this.config.binary.fetch || false,
      substrateRepositoryVersion: version || '',
      substrateLocalCompile: this.config.binary.localCompile || false,
      substrateBinaryName: this.config.binary.name,
      substrateUseDefaultSpec: this.config.validators.useDefaultSpec || false,
      substrateChainArgument: this.config.validators.chain || false,
      substrateBootnodeArgument: bootnodes,
      substrateTelemetryArgument: this.config.validators.telemetry || false,
      substrateOptions: substrateOptions,
      substrateRpcPort: this.config.validators.rpcPort || 9933,
      substrateNodeName: this.config.validators.name || false,
      // polkadotBinaryUrl: this.config.polkadotBinary.url,
      // polkadotBinaryChecksum: this.config.polkadotBinary.checksum,
      // polkadotNetworkId: this.config.polkadotNetworkId || 'ksmcc2',

      validators,
      // publicNodes,

      validatorTelemetryUrl: this.config.validators.telemetryUrl,
      // publicTelemetryUrl: this.config.publicNodes.telemetryUrl,

      validatorLoggingFilter: this.config.validators.loggingFilter,
      // publicLoggingFilter: this.config.publicNodes.loggingFilter,

      buildDir
    }
    if (this.config.nodeExporter && this.config.nodeExporter.enabled) {
      data.nodeExporterEnabled = true
      data.nodeExporterUsername = nodeExporterUsername
      data.nodeExporterPassword = nodeExporterPassword
      data.nodeExporterBinaryUrl = this.config.nodeExporter.binary.url
      data.nodeExporterBinaryChecksum = this.config.nodeExporter.binary.checksum
    } else {
      data.nodeExporterEnabled = false
    }
    if (this.config.nodeRestart && this.config.nodeRestart.enabled) {
      data.nodeRestartEnabled = true
      data.nodeRestartMinute = this.config.nodeRestart.minute || '*'
      data.nodeRestartHour = this.config.nodeRestart.hour || '*'
      data.nodeRestartDay = this.config.nodeRestart.day || '*'
      data.nodeRestartMonth = this.config.nodeRestart.month || '*'
      data.nodeRestartWeekDay = this.config.nodeRestart.weekDay || '*'
    } else {
      data.nodeRestartEnabled = false
    }

    // console.log({ origin, target, data })
    tpl.create(origin, target, data)

    return target
  }

  _arrayify(option) {
    let options = '['
    if (option) {
      for (let op of option) {
        options += `'${op}',`
      }
    }
    options += ']'
    return options
  }

  _getVersion(inputVersion) {
    if (inputVersion === undefined) {
      logger.warn('No repository version specified, using current HEAD.')
      return 'HEAD'
    } else {
      return inputVersion
    }
  }

  _genTplNodes(nodeSet) {
    const output = []
    // const vpnAddressBase = '10.0.0';
    // let counter = offset;

    nodeSet.nodes.forEach(node => {
      if (typeof node.ipAddresses == 'string') {
        const ipAddress = node.ipAddresses
        const item = {
          ipAddress,
          sshUser: node.sshUser
          // vpnAddress: `${vpnAddressBase}.${counter}`
        }
        output.push(item)
      } else {
        node.ipAddresses.forEach(ipAddress => {
          // counter++;
          const item = {
            ipAddress,
            sshUser: node.sshUser
            // vpnAddress: `${vpnAddressBase}.${counter}`
          }
          output.push(item)
        })
      }
    })
    return output
  }
}

module.exports = {
  Ansible
}
