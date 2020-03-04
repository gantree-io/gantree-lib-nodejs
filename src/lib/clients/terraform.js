const fs = require('fs-extra')
const path = require('path')

const cmd = require('../cmd')
const env = require('../env')
const { Project } = require('../project')
const ssh = require('../ssh')
const tpl = require('../tpl')
const provider_env_vars = require('../../static_data/provider_env_vars')
const { throwGantreeError } = require('../error')
const { returnLogger } = require('../logging')

const logger = returnLogger('terraform')

class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg))
    this._check_environment_variables(this.config.validators.nodes)

    const project = new Project(cfg)
    this.terraformOriginPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'terraform'
    )
    this.terraformTempPath = path.join(project.path(), 'terraform-temp')
    this.terraformPath = path.join(project.path(), 'terraform')

    this.options = {
      verbose: true
    }
  }

  async sync() {
    logger.info('Initialising Terraform')
    this._initializeTerraform()

    const sshKeys = ssh.keys()

    let validatorSyncPromises = []
    try {
      validatorSyncPromises = await this._create(
        'validator',
        sshKeys.validatorPublicKey,
        this.config.validators.nodes
      )
    } catch (e) {
      logger.error(`Could not get validator sync promises: ${e.message}`)
    }

    const syncPromises = validatorSyncPromises

    return Promise.all(syncPromises)
  }

  async clean() {
    this._initializeTerraform()
    let validatorCleanPromises = []
    try {
      validatorCleanPromises = await this._destroy(
        'validator',
        this.config.validators.nodes
      )
    } catch (e) {
      logger.error(`Could not get validator clean promises: ${e.message}`)
    }

    const cleanPromises = validatorCleanPromises

    return Promise.all(cleanPromises)
  }

  nodeOutput(type, counter, outputField) {
    const cwd = this._terraformNodeDirPath(type, counter)
    const options = { cwd }

    return this._cmd(`output -json ${outputField}`, options)
  }

  async _create(type, sshKeyPublic, nodes) {
    const createPromises = []

    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter)
      const nodeName = this._nodeName(type, counter)
      createPromises.push(
        new Promise(async resolve => {
          const options = { cwd }
          const init_options = { cwd, verbose: false }
          try {
            await this._cmd(`init`, init_options) // initialise terraform
          } catch (e) {
            throwGantreeError('PLATFORM_INIT_FAILED', e)
          }

          this._createVarsFile(cwd, nodes[counter], sshKeyPublic, nodeName)

          cmd.exec(`pwd`) // get working directory
          await this._cmd(`apply -auto-approve`, options) // terraform apply

          resolve(true)
        })
      )
    }
    return createPromises
  }

  async _check_environment_variables(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      let provider_n = nodes[i].provider
      if (provider_n in provider_env_vars) {
        const required_env_vars = provider_env_vars[provider_n]
        for (let i = 0; i < required_env_vars.length; i++) {
          const required_env_var = required_env_vars[i].name
          // if req env var not exported
          if (!(required_env_var in process.env)) {
            logger.error(
              `Required environment variable not found: ${required_env_var}`
            )
            throwGantreeError(
              'ENVIRONMENT_VARIABLE_MISSING',
              Error(
                `Required environment variable not found: ${required_env_var}`
              )
            )
          }
        }
      } else {
        logger.error(`Incompatible provider: ${provider_n}`)
        throwGantreeError(
          'BAD_CONFIG',
          Error(`Incompatible provider: ${provider_n}`)
        )
      }
    }
  }

  async _destroy(type, nodes) {
    const destroyPromises = []

    // bug: has zero regard for actual config, legacy code needs patching
    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter)
      destroyPromises.push(
        new Promise(async resolve => {
          const options = { cwd }
          await this._cmd(`init`, options)
          await this._cmd('destroy -lock=false -auto-approve', options)
          resolve(true)
        })
      )
    }
    return destroyPromises
  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options)
    return cmd.exec(`terraform ${command}`, actualOptions, { verbose: false })
  }

  _createVarsFile(cwd, node, sshKeyPublic, nodeName) {
    const data = {
      dir: path.resolve(__dirname),
      publicKey: sshKeyPublic,
      sshUser: node.sshUser,
      machineType: node.machineType,
      location: node.location,
      zone: node.zone,
      projectId: node.projectId,
      nodeCount: node.count || 1,
      name: nodeName
    }

    const source = path.join(__dirname, '..', '..', '..', 'tpl', 'tfvars')
    const target = path.join(cwd, 'terraform.tfvars')

    tpl.create(source, target, data)
  }

  _initializeTerraform() {
    fs.removeSync(this.terraformTempPath)
    fs.ensureDirSync(this.terraformTempPath)

    for (
      let counter = 0;
      counter < this.config.validators.nodes.length;
      counter++
    ) {
      this._copyTerraformFiles(
        'validator',
        counter,
        this.config.validators.nodes[counter].provider
      )
    }
  }

  _copyTerraformFiles(type, counter, provider) {
    const targetDirPath = this._terraformNodeDirPath(type, counter)
    const originDirPath = path.join(this.terraformOriginPath, provider)
    fs.ensureDirSync(targetDirPath)

    const name = this._nodeName(type, counter)

    fs.readdirSync(originDirPath).forEach(item => {
      const origin = path.join(originDirPath, item)
      const target = path.join(targetDirPath, item)
      const envStatePath =
        env.terraformStatefilePath || path.join(this.terraformPath, 'state')
      if (!path.isAbsolute(envStatePath)) {
        throw new Error(
          `terraform statefile path must be absolute, was given: ${envStatePath}`
        )
      }
      const data = {
        name,
        tfstateDir: path.normalize(envStatePath)
      }
      tpl.create(origin, target, data)
    })
  }

  _terraformNodeDirPath(type, counter = 0) {
    const dirName = this._nodeName(type, counter)
    return path.join(this.terraformTempPath, dirName)
  }

  _nodeName(type, counter) {
    const name = `${type}${counter}`
    return name.toLowerCase()
  }
}

module.exports = {
  Terraform
}
