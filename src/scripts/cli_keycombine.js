#!/usr/bin/env node

const program = require('commander')
const { throwGantreeError } = require('../lib/error')
const { keyCombine } = require('../lib/dataManip/key-combine')

program
  .description(
    'Combines multiple validator key yaml into a single validator key json file.'
  )
  .option(
    '-d, --directory [path]',
    'Path to session directory.',
    '/tmp/gantree_host/session'
  )
  .action(keyCombine_CLI)

program.allowUnknownOption(false)

// const parsed = program.parse(process.argv)
program.parse(process.argv)

async function keyCombine_CLI(cmd) {
  if (cmd.directory === undefined) {
    throwGantreeError(
      'MISSING_ARGUMENTS',
      Error('Path to the session directory missing')
    )
  }
  keyCombine(cmd.directory)
}
