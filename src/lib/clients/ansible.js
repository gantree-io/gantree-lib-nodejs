const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const process = require('process')
const AJV = require('ajv')

const cmd = require('../cmd')
const { Project } = require('../project')
const tpl = require('../tpl')
const { nodeExporterUsername, nodeExporterPassword } = require('../env')
const gantree_config_schema = require('../../schemas/gantree_config_schema')

const inventoryFileName = 'inventory'

class Ansible {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg))

    this.ansiblePath = path.join(__dirname, '..', '..', '..', 'ansible')
    this.options = {
      cwd: this.ansiblePath,
      verbose: true
    }
  }

  async sync() {
    const inventoryPath = this._writeInventory()
    console.log({ inventoryPath })
    //return this._cmd(`all -b -m ping -i ${inventoryFileName}`, this.options);
    //return this._cmd(`main.yml -vvvv -f 30 -i ${inventoryPath}`);

    return this._cmd(`main.yml -f 30 -i "${inventoryPath}"`) // COMMENTED OUT TEMPORARILY
    // NO ANSIBLE FOR THE MOMENT, DO NOT COMMIT
    const chalk = require('chalk')
    console.log(
      chalk.red(
        '[WARNING!!!]: skipping ansible, uncomment line 29 of ansible.js!!!'
      )
    )
  }

  async clean() {}

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options)
    return cmd.exec(`ansible-playbook ${command}`, actualOptions)
  }

  _check_required_fields_met() {
    const ajv = new AJV()
    const validate = ajv.compile(gantree_config_schema)
    console.log(validate)

    // console.log("EXITING EARLY...")
    // process.exit(-1)

    let fields_missing = []

    if (this.config.project == undefined) {
      fields_missing.push("1st level key: 'project' [str]")
    }
    if (this.config.repository == undefined) {
      fields_missing.push('1st level key: repository [obj]')
    } else {
      if (this.config.repository.url == undefined) {
        fields_missing.push('2nd level key: repository > url [str]')
      }
      if (this.config.repository.version == undefined) {
        fields_missing.push('2nd level key: repository > version [str]')
      }
    }
    if (this.config.validators == undefined) {
      fields_missing.push('1nd level key: validators [obj]')
    }

    if (fields_missing.length > 0) {
      console.log(chalk.red('[Gantree] missing required values in config!:'))
      for (let i = 0; i < fields_missing.length; i++) {
        console.log(chalk.red(`-- missing field: ${fields_missing[i]}`))
      }
      process.exit(-1)
    }
  }

  _writeInventory() {
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
    console.log({ origin, project, buildDir, target, validators })
    // const publicNodes = this._genTplNodes(this.config.publicNodes, validators.length);

    this._check_required_fields_met()

    const data = {
      project: this.config.project,

      substrateRepository: this.config.repository.url,
      substrateRepositoryVersion: this.config.repository.version,
      substrateBinaryName: this.config.repository.binaryName,
      substrateUseDefaultSpec: this.config.repository.useDefaultSpec || false,
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

    console.log({ origin, target, data })
    tpl.create(origin, target, data)

    return target
  }

  _genTplNodes(nodeSet, offset = 0) {
    const output = []
    // const vpnAddressBase = '10.0.0';
    // let counter = offset;

    nodeSet.nodes.forEach(node => {
      console.log(`node.ipAddresses ${node.ipAddresses}`)
      console.log(typeof node.ipAddresses)
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
