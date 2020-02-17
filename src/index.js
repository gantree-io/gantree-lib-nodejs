#!/usr/bin/env node

const path = require('path')
const process = require('process')
const program = require('commander')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
require('dotenv').config({ path: path.resolve(process.cwd(), 'config/.env') })

const clean = require('./lib/actions/clean')
const sync = require('./lib/actions/sync')
const inject = require('./lib/actions/inject')
const keyCombine = require('./lib/actions/key-combine')
const version = require('./lib/version')

program.version(version.show())

program
  .command('sync')
  .description('Synchronizes the infrastructure.')
  .option('-c, --config [config] (required)', 'Path to config file.')
  .action(sync.do)

program
  .command('clean')
  .description('Removes all the resources.')
  .option('-c, --config [config] (required)', 'Path to config file.')
  .action(clean.do)

program
  .command('inject')
  .description('Injects keys into chainspec (non-raw).')
  .option('-c, --chainspec [path]', 'Path to chainspec file.')
  .option('-v, --validatorspec [path]', 'Path to validatorspec file.')
  .option(
    '-R, --allow-raw',
    'Allow usage of raw chainspec (returns raw chainspec in stdout)',
    false
  )
  .action(inject.do)

program
  .command('key-combine')
  .description(
    'Combines multiple validator key yaml into a single validator key json file.'
  )
  .option(
    '-d, --directory [path]',
    'Path to session directory.',
    '/tmp/gantree_host/session'
  )
  .action(keyCombine.do)

program.allowUnknownOption(false)

const parsed = program.parse(process.argv)
if (
  !parsed ||
  !(
    parsed.args &&
    parsed.args.length > 0 &&
    typeof (parsed.args[0] === 'object')
  )
) {
  program.outputHelp()
}
