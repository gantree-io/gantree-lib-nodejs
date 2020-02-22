const { returnLogger } = require('./logging')

const logger = returnLogger('counter')


class Counter {
    constructor(FUNC_run_each_count, action_trigger_count) {
        if (FUNC_run_each_count === undefined) {
            logger.error("Please specify a callback to run on each count")
            console.error("Please specify a callback to run on each count")
            process.exit(1)
        }
        if (action_trigger_count === undefined) {
            logger.error("Please specify a count at which to trigger the action")
            console.error("Please specify a count at which to trigger the action")
            process.exit(1)
        }
        this.counting = false
        this.count = 0
        this.FUNC_run_each_count = FUNC_run_each_count
        this.action_trigger_count = action_trigger_count
        this.count_until_false = this.count_until_false.bind(this)
        this._increase_count_and_run = this._increase_count_and_run.bind(this)
        this.stop_counting = this.stop_counting.bind(this)
    }

    async count_until_false() {
        this.counting = true
        this.countIncreaser = setInterval(this._increase_count_and_run, 1000)
    }

    async stop_counting() {
        // process.stdout.write("x")
        if (this.count >= this.action_trigger_count) {
            process.stdout.write("DONE\n")
        }
        clearInterval(this.countIncreaser)
        this.counting = false
        this.count = 0
    }

    async _increase_count_and_run() {
        this.count = this.count + 1
        // console.log(`count increased = ${this.count}`)
        this.FUNC_run_each_count(this.count, this.action_trigger_count)
    }
}

module.exports = {
    Counter
}
