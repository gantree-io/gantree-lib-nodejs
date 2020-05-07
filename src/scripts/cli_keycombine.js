#!/usr/bin/env node

const program = require('commander')
const {
  GantreeError,
  ErrorTypes: { MISSING_ARGUMENTS }
} = require('../lib/gantree-error')
const { keyCombine } = require('../lib/tools/key-combine')

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
    throw new GantreeError(
      MISSING_ARGUMENTS,
      'Path to the session directory missing'
    )
  }
  keyCombine(cmd.directory)
}
