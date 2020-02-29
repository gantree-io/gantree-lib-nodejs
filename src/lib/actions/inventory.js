const chalk = require('chalk')
const process = require('process')
const util = require('util')
const exec = util.promisify(require('child_process').exec);

const config = require('../config.js')
const { Platform } = require('../platform.js')
const { Application } = require('../application.js')

const dofunc = async cmd => {
  const configPath = process.env.GANTREE_INVENTORY_CONFIG_PATH

  if (!configPath) {
    console.error(chalk.red('[Gantree] Error: env|GANTREE_INVENTORY_CONFIG_PATH required.'))
    process.exit(-1)
  }

  const cfg = config.read(configPath)

  // TODO: re-add this
  // config.validate(cfg)

  const di = await buildDynamicInventory(cfg)

  process.stdout.write(JSON.stringify(di, null, 2))
}

const buildDynamicInventory = async (c) => {
  // get the python for current environment so we can pass it around ansible if needed
  const pythonLocalPython = await exec('python -c "import sys; print(sys.executable)"')
  const localPython = pythonLocalPython.stdout

  //console.log(c)
  const o = {
    _meta: {
      hostvars: {
        localhost: {
          infra: [

          ]
        }
      }
    },
    provider_gcp: {
      vars: {
        ansible_user: 'root'
      }
    },
    local: {
      hosts: ['localhost'],
      vars: {
        ansible_python_interpreter: localPython,
        ansible_connection: 'local',
        infra: [
          "wat"
        ]
      }
    },
    all: {
      vars: {
        gantree_control_working: "/tmp/gantree-control/",
        ansible_ssh_common_args: '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s'
      }
    }
  }

  c.validators.nodes.forEach((item, idx) => {
    const newInfra = {
      provider: item.provider,
      instance_name: item.name || ("node" + idx),
      machine_type: item.machineType,
      deletion_protection: item.deletionProtection,
      zone: item.zone,
      region: item.region,
      ssh_user: item.sshUser,
      ssh_key: item.sshKey,
      gcp_project: item.projectId,
      state: "present"
    }
    o._meta.hostvars.localhost.infra.push(newInfra)
  })

  return o
}

const parseValidators = (vs) => {

}

module.exports = {
  do: dofunc
}
