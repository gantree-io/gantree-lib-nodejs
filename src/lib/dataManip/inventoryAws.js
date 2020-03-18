//todo: cleanup for lib-centric approach
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const writeAwsFile = (c, invPath) => {
  const regions = getAwsRegions(c)

  const awsInvPath = path.join(invPath, 'aws_ec2.yml')

  if (fs.existsSync(awsInvPath)) {
    fs.unlinkSync(awsInvPath)
  }

  if (regions.length > 0) {
    const awsInv = createAwsInventory({ regions })
    fs.writeFileSync(awsInvPath, awsInv, 'utf8')
  }
}

const getAwsRegions = c => {
  const regions = []
  c.nodes.forEach(n => {
    if (n.instance.provider != 'aws') return
    if (!n.instance.region) return
    if (regions.includes(n.instance.region)) return

    regions.push(n.instance.region)
  })
  return regions
}

const createAwsInventory = vars => {
  const inv = {
    plugin: 'aws_ec2',
    regions: vars.regions || [],
    filters: {
      'tag:gantree': 'managed'
    },
    strict_permissions: false,
    hostnames: ['network-interface.association.public-ip'],
    keyed_groups: [
      {
        key: "tags['group_name']",
        separator: ''
      }
    ]
  }

  return yaml.safeDump(inv)
}

module.exports = {
  writeFile: writeAwsFile
}
