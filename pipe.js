const funcConcat = require('./_internal/funcConcat')
const funcConcatSync = require('./_internal/funcConcatSync')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')

/**
 * @name pipe
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var args ...any,
 *   funcs [
 *     ...args=>Promise|any,
 *     ...Array<any=>Promise|any>,
 *   ],
 *   transducers Array<Reducer=>Reducer>
 *
 * pipe(funcs) -> pipeline ...args=>Promise|any
 *
 * pipe(transducers) -> chainedTransducer Reducer=>Reducer
 * ```
 *
 * @description
 * Chain together an array of functions as a pipe, each function passing its return value as the first argument to the next function until all functions have executed. The final result is the return of the last function execution.
 *
 * ```javascript [playground]
 * console.log(
 *   pipe([
 *     number => number + 1,
 *     number => number + 2,
 *     number => number + 3,
 *   ])(5),
 * ) // 11
 * ```
 *
 * When passed a reducer, a pipe of transducers composes the reducer such that the transducers are applied in series, calling the reducer as the last step to end the chain. The resulting reducer must be used in conjunction with `reduce` to have a transducing effect. For more information on this behavior, see [this resource on transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const square = number => number ** 2
 *
 * const add = (a, b) => a + b
 *
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
 * ])
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squaredOdds(add), 0),
 * ) // 35
 *
 * console.log(
 *   squaredOdds([1, 2, 3, 4, 5])
 * ) // [1, 9, 25]
 * ```
 *
 * @execution series
 *
 * @transducing
 */
const pipe = function (funcs) {
  const functionPipeline = funcs.reduce(funcConcat),
    functionComposition = funcs.reduceRight(funcConcat)
  return function pipeline(...args) {
    const firstArg = args[0]
    if (
      typeof firstArg == 'function'
        && !isGeneratorFunction(firstArg)
        && !isAsyncGeneratorFunction(firstArg)
    ) {
      return functionComposition(...args)
    }
    return functionPipeline(...args)
  }
}

// funcs Array<function> -> pipeline function
const pipeSync = funcs => funcs.reduce(funcConcatSync)

/**
 * @name pipe.sync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   funcs [...args=>any, ...Array<any=>any>]
 *
 * pipe.sync(funcs) -> syncPipeline ...args=>any
 * ```
 *
 * @description
 * `pipe` that doesn't automatically resolve promises. This variant is a good option if more performance is desired or if manual promise handling is required.
 *
 * ```javascript [playground]
 * pipe.sync([
 *   value => Promise.resolve(value),
 *   promise => promise.then(console.log)
 * ])('hey') // hey
 * ```
 */
pipe.sync = pipeSync

module.exports = pipe
