'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var url = _interopDefault(require('url'));
var crypto = _interopDefault(require('crypto'));
var os = _interopDefault(require('os'));
var tty = _interopDefault(require('tty'));
var util = _interopDefault(require('util'));
var assert = _interopDefault(require('assert'));
var net = _interopDefault(require('net'));
var tls = _interopDefault(require('tls'));
var stream = _interopDefault(require('stream'));
var buffer = _interopDefault(require('buffer'));
var string_decoder = _interopDefault(require('string_decoder'));
var events = _interopDefault(require('events'));

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = module.exports;

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);
});

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function Codic(driver) {
  this.driver = driver;
}

function start () {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee3() {
    var that, r;
    return regenerator.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            that = this;
            _context3.next = 3;
            return this.driver.getActivities();

          case 3:
            r = _context3.sent;
            _context3.next = 6;
            return r.map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee2(activity) {
                return regenerator.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        activity.tasks.forEach(
                        /*#__PURE__*/
                        function () {
                          var _ref3 = _asyncToGenerator(
                          /*#__PURE__*/
                          regenerator.mark(function _callee(taskName) {
                            return regenerator.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return that.driver.getTask(taskName);

                                  case 2:
                                    if (_context.sent) {
                                      _context.next = 4;
                                      break;
                                    }

                                    console.warn(taskName + " is not a valid task or does not exist");

                                  case 4:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee, this);
                          }));

                          return function (_x3) {
                            return _ref3.apply(this, arguments);
                          };
                        }());

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 6:
            _context3.next = 8;
            return tryRun(this);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _ref.apply(this, arguments);
}

function tryRun(_x) {
  return _tryRun.apply(this, arguments);
}

function _tryRun() {
  _tryRun = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee5(codic) {
    return regenerator.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            codic.runThrough(function (err, nextRun) {
              setTimeout(
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee4() {
                return regenerator.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return tryRun(codic);

                      case 2:
                        return _context4.abrupt("return", _context4.sent);

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              })), nextRun);
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _tryRun.apply(this, arguments);
}

/**
 * Lets manage the type of activity here for now
 */
var aType = {
  REPEAT: "recurring",
  ONCE: "once",
  TEMP: "temp"
};

/**
 * Setup repeatition for task
 * @param {String} timesheet time to repeat
 * @param  {...any} rest fn arguments
 */

function every(timesheet) {
  this.type = aType.REPEAT;
  this.timesheet = timesheet;
  this.nextRun = Date.now() + timesheet * 1000;

  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return rest.length > 0 ? this.use.apply(this, rest) : this;
}

function at(timesheet) {
  this.type = aType.ONCE;
  this.timesheet = timesheet;
  return this.save();
}

/**
 * Lets maintain the status of each activity here in case we have to add more
 */
var status = {
  ACTIVE: 1,
  DISABLED: 0
};

function disable() {
  this.status = status.DISABLED;
  return this;
}

function disable$1() {
  this.status = status.ACTIVE;
  return this;
}

function isDue(at) {
  return this.nextRun - at <= 0;
}

function isActive() {
  return this.status === status.ACTIVE;
}

function createTasks(tasks) {
  if (typeof tasks === "string" && tasks.length > 0) tasks = [tasks];
  if (!Array.isArray(tasks)) throw new Error("Tasks requires array or string");
  if (tasks.length == 0) throw new Error("No tasks defined for activity");
  this.tasks = tasks;
}

function save() {
  return _save.apply(this, arguments);
}

function _save() {
  _save = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.driver.saveActivity(this);

          case 2:
            return _context.abrupt("return", this);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _save.apply(this, arguments);
}

var remove = (function () {});

function use(data) {
  this.attrs = _objectSpread({}, this.attrs, {
    data: data
  });
  return this;
}

function copyConfig(to, from) {
  if (from.driver) to.driver = from.driver;
  to.id = from.id;
  Object.keys(from).forEach(function (key) {
    if (to[key] !== undefined) to[key] = from[key];
  });
  if (!to.nextRun) to.updateNextRun(Date.now());
  return to;
}
function Activity(tasks, config) {
  this.status = status.ACTIVE;
  this.nextRun = null;
  this.lastRun = null;
  this.failedAt = null;
  this.failReason = null;
  this.type = aType.TEMP;
  this.timesheet = "";
  this.driver = null;
  this.attrs = {
    skipInitial: true
  };
  copyConfig(this, config);
  this.createTasks(tasks, this.driver);
}

function getTasks () {
  return _ref$1.apply(this, arguments);
}

function _ref$1() {
  _ref$1 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2() {
    var _this = this;

    var res;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = Promise;
            _context2.next = 3;
            return this.tasks.map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee(name) {
                var task;
                return regenerator.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _this.driver.getTask(name);

                      case 2:
                        task = _context.sent;
                        task = _objectSpread({}, task, {
                          activity: _this
                        });
                        return _context.abrupt("return", task);

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 3:
            _context2.t1 = _context2.sent;
            _context2.next = 6;
            return _context2.t0.all.call(_context2.t0, _context2.t1);

          case 6:
            res = _context2.sent;
            return _context2.abrupt("return", res);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _ref$1.apply(this, arguments);
}

Activity.prototype = {
  at: at,
  use: use,
  save: save,
  every: every,
  isDue: isDue,
  remove: remove,
  enable: disable$1,
  disable: disable,
  isActive: isActive,
  getTasks: getTasks,
  createTasks: createTasks
};

Activity.prototype.updateNextRun =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(from) {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.nextRun = from + this.timesheet * 1000;
            this.lastrun = from;
            _context.next = 4;
            return this.save();

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

Activity.prototype.makeId = function () {
  if (!this.id) this.id = Math.random().toString(36).slice(2);
  return this;
};

function run (jobs) {
  var activity = new Activity(jobs, {
    driver: this.driver
  });

  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return rest.length > 0 ? activity.every.apply(activity, rest) : activity;
}

var defaultProps = {
  priority: 1,
  status: 1
};
function copyConfig$1(to, from) {
  if (from.priority) to.priority = from.priority;
  return to;
}
function Task(name, config, definition) {
  copyConfig$1(this, _objectSpread({}, defaultProps, config));
  this.name = name;
  this.definition = definition;
}

function assign(_x) {
  return _assign.apply(this, arguments);
}

function _assign() {
  _assign = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(name) {
    var config,
        def,
        task,
        _args = arguments;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = {};

            if (!(_args.length < 2)) {
              _context.next = 3;
              break;
            }

            throw "Assign requires at least two arguments; Name and task definition";

          case 3:
            if (_args.length === 2) def = _args[1];else if (_args.length === 3) {
              config = _args[1];
              def = _args[2];
            }

            if (!(typeof name !== "string")) {
              _context.next = 6;
              break;
            }

            throw "Invalid Task name. Requires a string";

          case 6:
            if (!(typeof def !== "function")) {
              _context.next = 8;
              break;
            }

            throw "Invalid Job definition. Requires a function";

          case 8:
            if (!(_typeof(config) !== "object")) {
              _context.next = 10;
              break;
            }

            throw "Invalid config parameter. Requires an object";

          case 10:
            task = new Task(name, config, def);
            _context.next = 13;
            return this.driver.saveTask(task);

          case 13:
            return _context.abrupt("return", _context.sent);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _assign.apply(this, arguments);
}

function pause() {
  console.log(this.driver);
}

function runThrough (_x) {
  return _ref$2.apply(this, arguments);
}

function _ref$2() {
  _ref$2 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2(cb) {
    var now, __due_tasks, __due;

    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            now = Date.now();
            __due_tasks = [];
            _context2.next = 4;
            return this.driver.getDueActivities();

          case 4:
            __due = _context2.sent;
            _context2.t0 = Promise;
            _context2.next = 8;
            return __due.map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee(activity) {
                var t, tasks;
                return regenerator.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        t = activity.nextRun;
                        _context.next = 3;
                        return activity.updateNextRun(now);

                      case 3:
                        activity = _context.sent;
                        _context.next = 6;
                        return activity.getTasks();

                      case 6:
                        tasks = _context.sent;
                        __due_tasks = _toConsumableArray(__due_tasks).concat(_toConsumableArray(tasks));
                        return _context.abrupt("return", tasks);

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 8:
            _context2.t1 = _context2.sent;
            _context2.next = 11;
            return _context2.t0.all.call(_context2.t0, _context2.t1);

          case 11:
            if (!(__due_tasks.length > 0)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 14;
            return r(__due_tasks, cb, this.driver);

          case 14:
            _context2.next = 21;
            break;

          case 16:
            _context2.t2 = cb;
            _context2.next = 19;
            return this.driver.getNextRunDelay();

          case 19:
            _context2.t3 = _context2.sent;
            (0, _context2.t2)(null, _context2.t3);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _ref$2.apply(this, arguments);
}

function prioritize(tasks) {
  tasks.sort(function (a, b) {
    return a.priority > b.priority;
  });
  return tasks;
}

function r(_x2, _x3, _x4) {
  return _r.apply(this, arguments);
}

function _r() {
  _r = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee4(tasks, cb, driver) {
    var _runs;

    return regenerator.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            prioritize(tasks);
            _context4.next = 3;
            return tasks.map(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee3(task) {
                var activity;
                return regenerator.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        activity = task.activity;
                        _context3.next = 3;
                        return task.definition(activity, function () {});

                      case 3:
                        return _context3.abrupt("return", _context3.sent);

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 3:
            _runs = _context4.sent;
            return _context4.abrupt("return", Promise.all(_runs).catch(function (err) {
              cb(null, driver.getNextRunDelay());
            }).then(function (r, s) {
              cb(null, driver.getNextRunDelay());
            }));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _r.apply(this, arguments);
}

Codic.prototype = {
  pause: pause,
  start: start,
  run: run,
  assign: assign,
  runThrough: runThrough
};

var JSONfn;

if (!JSONfn) {
  JSONfn = {};
}

(function () {
  JSONfn.stringify = function (obj) {
    return JSON.stringify(obj, function (key, value) {
      return typeof value === "function" ? value.toString() : value;
    });
  };

  JSONfn.parse = function (str) {
    return JSON.parse(str, function (key, value) {
      if (typeof value != "string") return value;
      return value.substring(0, 8) == "function" ? eval("(" + value + ")") : value;
    });
  };
})();

var JSONfn$1 = JSONfn;

function saveTask (_x) {
  return _ref$3.apply(this, arguments);
}

function _ref$3() {
  _ref$3 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(task) {
    var _tasks, exist;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getTasks();

          case 2:
            _tasks = _context.sent;
            exist = _tasks.find(function (x) {
              return x.name === task.name;
            });

            if (exist) {
              _tasks = _tasks.map(function (x) {
                return x.name === task.name ? task : x;
              });
            } else {
              _tasks.push(task);
            }

            _context.next = 7;
            return this.db.set(this.keyBase + ":task", JSONfn$1.stringify(_tasks));

          case 7:
            return _context.abrupt("return", task);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _ref$3.apply(this, arguments);
}

function recreateTask(task) {
  var name = task.name,
      definition = task.definition,
      config = _objectWithoutProperties(task, ["name", "definition"]);

  return new Task(name, config, definition);
}

function getTask (_x) {
  return _ref$4.apply(this, arguments);
}

function _ref$4() {
  _ref$4 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(name) {
    var tasks, task;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getTasks();

          case 2:
            tasks = _context.sent;
            task = tasks.find(function (task) {
              return task.name === name;
            });
            return _context.abrupt("return", task ? recreateTask(task) : null);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _ref$4.apply(this, arguments);
}

function getTasks$1() {
  return _getTasks.apply(this, arguments);
}

function _getTasks() {
  _getTasks = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    var res, tasks;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getTasksRaw();

          case 2:
            res = _context.sent;
            tasks = res.map(function (task) {
              return recreateTask(task);
            });
            return _context.abrupt("return", tasks);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getTasks.apply(this, arguments);
}

function getTasksRaw() {
  return _getTasksRaw.apply(this, arguments);
}

function _getTasksRaw() {
  _getTasksRaw = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    var res;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.db.get(this.keyBase + ":task");

          case 2:
            res = _context.sent;
            return _context.abrupt("return", res ? JSONfn$1.parse(res) : []);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getTasksRaw.apply(this, arguments);
}

function removeTask (_x) {
  return _ref$5.apply(this, arguments);
}

function _ref$5() {
  _ref$5 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(name) {
    var tasks;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getTasks();

          case 2:
            tasks = _context.sent;
            tasks = tasks.filter(function (t) {
              return t.name !== name;
            });
            _context.next = 6;
            return this.db.set(this.keyBase + ":task", JSONfn$1.stringify(tasks));

          case 6:
            return _context.abrupt("return", true);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _ref$5.apply(this, arguments);
}

function Tasks() {}

Tasks.prototype = {
  getTask: getTask,
  saveTask: saveTask,
  removeTask: removeTask,
  getTasks: getTasks$1,
  getTasksRaw: getTasksRaw
};

function saveActivity (_x) {
  return _ref$6.apply(this, arguments);
}

function _ref$6() {
  _ref$6 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(activity) {
    var current, exist;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getActivitiesRaw();

          case 2:
            current = _context.sent;
            exist = current.find(function (x) {
              return x.timesheet === activity.timesheet && JSONfn$1.stringify(x.tasks) == JSONfn$1.stringify(activity.tasks);
            });
            delete activity.driver;

            if (!exist) {
              activity.makeId();
              current.push(activity);
            } else current = current.map(function (x) {
              return x.id === activity.id ? activity : x;
            });

            _context.next = 8;
            return this.db.set(this.keyBase + ":activity", JSONfn$1.stringify(current));

          case 8:
            activity.driver = this;
            return _context.abrupt("return", activity);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _ref$6.apply(this, arguments);
}

function getActivitiesRaw() {
  return _getActivitiesRaw.apply(this, arguments);
}

function _getActivitiesRaw() {
  _getActivitiesRaw = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    var res;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.db.get(this.keyBase + ":activity");

          case 2:
            res = _context.sent;
            return _context.abrupt("return", res ? JSONfn$1.parse(res) : []);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getActivitiesRaw.apply(this, arguments);
}

function getActivities() {
  return _getActivities.apply(this, arguments);
}

function _getActivities() {
  _getActivities = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2() {
    var _this = this;

    var res, _o;

    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return this.getActivitiesRaw();

          case 2:
            res = _context2.sent;
            _o = res.map(function (activity) {
              return _this.recreateActivity(activity);
            });
            return _context2.abrupt("return", _o);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _getActivities.apply(this, arguments);
}

function getActiveActivities () {
  return _ref$7.apply(this, arguments);
}

function _ref$7() {
  _ref$7 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    var r;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getActivities();

          case 2:
            r = _context.sent;
            r = r.filter(function (x) {
              return x.isActive();
            });
            return _context.abrupt("return", r);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _ref$7.apply(this, arguments);
}

function getNextRunDelay() {
  return _getNextRunDelay.apply(this, arguments);
}

function _getNextRunDelay() {
  _getNextRunDelay = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    var dt, now, list;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dt = null;
            now = Date.now();
            _context.next = 4;
            return this.getActiveActivities();

          case 4:
            list = _context.sent;
            list.forEach(function (activity) {
              var nR = activity.nextRun;
              if (!dt) dt = nR;else dt = nR < dt ? nR : dt;
            });
            return _context.abrupt("return", Math.ceil((dt - now) / 1000) * 1000);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getNextRunDelay.apply(this, arguments);
}

function getDueList() {
  return _getDueList.apply(this, arguments);
}

function _getDueList() {
  _getDueList = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    var __due, now, active;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // set up array to contain cron tasks that are ready to execute
            __due = [];
            now = Date.now();
            _context.next = 4;
            return this.getActiveActivities();

          case 4:
            active = _context.sent;
            active.forEach(function (activity) {
              if (activity.isDue(now)) {
                __due.push(activity);
              }
            });
            return _context.abrupt("return", __due);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getDueList.apply(this, arguments);
}

function getActivity (_x) {
  return _ref$8.apply(this, arguments);
}

function _ref$8() {
  _ref$8 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(id) {
    var activities, activity;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.getActivities();

          case 2:
            activities = _context.sent;
            activity = activities.find(function (activity) {
              return activity.id === id;
            });
            return _context.abrupt("return", activity || null);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _ref$8.apply(this, arguments);
}

function getActivitiesRaw$1() {
  return _getActivitiesRaw$1.apply(this, arguments);
}

function _getActivitiesRaw$1() {
  _getActivitiesRaw$1 = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.db.del(this.keyBase + ":activity");

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getActivitiesRaw$1.apply(this, arguments);
}

function recreateActivity(activity) {
  var tasks = activity.tasks,
      config = _objectWithoutProperties(activity, ["tasks"]);

  config.driver = this;
  return new Activity(tasks, config);
}

function Activities() {//read from storage
}

Activities.prototype = {
  clean: getActivitiesRaw$1,
  getActivity: getActivity,
  saveActivity: saveActivity,
  getActivities: getActivities,
  getNextRunDelay: getNextRunDelay,
  recreateActivity: recreateActivity,
  getDueActivities: getDueList,
  getActivitiesRaw: getActivitiesRaw,
  getActiveActivities: getActiveActivities
};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, typeof iteratee == 'function' ? iteratee : identity);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var lodash_foreach = forEach;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER$1 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var Symbol$1 = root.Symbol,
    propertyIsEnumerable$1 = objectProto$1.propertyIsEnumerable,
    spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, props) {
  object = Object(object);
  return basePickBy(object, props, function(value, key) {
    return key in object;
  });
}

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick from.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, props, predicate) {
  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index],
        value = object[key];

    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray$1(value) || isArguments$1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$1(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$1(value) && hasOwnProperty$1.call(value, 'callee') &&
    (!propertyIsEnumerable$1.call(value, 'callee') || objectToString$1.call(value) == argsTag$1);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction$1(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike$1(value) && isArrayLike$1(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$1(value) && objectToString$1.call(value) == symbolTag);
}

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = baseRest(function(object, props) {
  return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
});

var lodash_pick = pick;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$2 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    funcTag$2 = '[object Function]',
    genTag$2 = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint$1 = /^(?:0|[1-9]\d*)$/;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply$1(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$2 = objectProto$2.toString;

/** Built-in value references. */
var propertyIsEnumerable$2 = objectProto$2.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$1(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$2(value) || isArguments$2(value))
    ? baseTimes$1(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$2.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex$1(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto$2[key]) && !hasOwnProperty$2.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject$2(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype$1(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$2.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$1(func, start) {
  start = nativeMax$1(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$1(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply$1(func, this, otherArgs);
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest$1(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$1(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$2 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$1.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject$2(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike$2(object) && isIndex$1(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$2;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$2(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$2(value) && hasOwnProperty$2.call(value, 'callee') &&
    (!propertyIsEnumerable$2.call(value, 'callee') || objectToString$2.call(value) == argsTag$2);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$2 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$2(value) {
  return value != null && isLength$2(value.length) && !isFunction$2(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$2(value) {
  return isObjectLike$2(value) && isArrayLike$2(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$2(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$2(value) ? objectToString$2.call(value) : '';
  return tag == funcTag$2 || tag == genTag$2;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$2(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$2;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$2(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest$1(function(args) {
  args.push(undefined, assignInDefaults);
  return apply$1(assignInWith, undefined, args);
});

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike$2(object) ? arrayLikeKeys$1(object, true) : baseKeysIn(object);
}

var lodash_defaults = defaults;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$3 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    funcTag$3 = '[object Function]',
    genTag$3 = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply$2(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$1(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush$1(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto$3 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$3 = objectProto$3.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$3).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$2 = root$1.Symbol,
    propertyIsEnumerable$3 = objectProto$3.propertyIsEnumerable,
    splice = arrayProto.splice,
    spreadableSymbol$1 = Symbol$2 ? Symbol$2.isConcatSpreadable : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$2 = Math.max;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root$1, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap$1(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten$1(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable$1);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$1(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$1(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject$3(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction$3(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$2(func, start) {
  start = nativeMax$2(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$2(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply$2(func, this, otherArgs);
  };
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable$1(value) {
  return isArray$3(value) || isArguments$3(value) ||
    !!(spreadableSymbol$1 && value && value[spreadableSymbol$1]);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest$2(function(array, values) {
  return isArrayLikeObject$3(array)
    ? baseDifference(array, baseFlatten$1(values, 1, isArrayLikeObject$3, true))
    : [];
});

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$3(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$3(value) && hasOwnProperty$3.call(value, 'callee') &&
    (!propertyIsEnumerable$3.call(value, 'callee') || objectToString$3.call(value) == argsTag$3);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$3 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$3(value) {
  return value != null && isLength$3(value.length) && !isFunction$3(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$3(value) {
  return isObjectLike$3(value) && isArrayLike$3(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$3(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$3(value) ? objectToString$3.call(value) : '';
  return tag == funcTag$3 || tag == genTag$3;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$3(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$3;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$3(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$3(value) {
  return !!value && typeof value == 'object';
}

var lodash_difference = difference;

var lodash_clone = createCommonjsModule(function (module, exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer$$1, isDeep) {
  if (isDeep) {
    return buffer$$1.slice();
  }
  var result = new buffer$$1.constructor(buffer$$1.length);
  buffer$$1.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer$$1 = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer$$1, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer$$1 = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer$$1, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, false, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = clone;
});

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$4 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$4 = '[object Arguments]',
    funcTag$4 = '[object Function]',
    genTag$4 = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint$2 = /^(?:0|[1-9]\d*)$/;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$2(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$2(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap$2(props, function(key) {
    return object[key];
  });
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$4 = objectProto$4.toString;

/** Built-in value references. */
var propertyIsEnumerable$4 = objectProto$4.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeKeys$1 = overArg$1(Object.keys, Object),
    nativeRandom = Math.random;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$2(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$4(value) || isArguments$4(value))
    ? baseTimes$2(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$4.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex$2(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype$2(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.random` without support for returning
 * floating-point numbers.
 *
 * @private
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the random number.
 */
function baseRandom(lower, upper) {
  return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$2(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$4 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$2.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$2(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

  return value === proto;
}

/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */
function sample(collection) {
  var array = isArrayLike$4(collection) ? collection : values(collection),
      length = array.length;

  return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$4(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$4(value) && hasOwnProperty$4.call(value, 'callee') &&
    (!propertyIsEnumerable$4.call(value, 'callee') || objectToString$4.call(value) == argsTag$4);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$4 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$4(value) {
  return value != null && isLength$4(value.length) && !isFunction$4(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$4(value) {
  return isObjectLike$4(value) && isArrayLike$4(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$4(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$4(value) ? objectToString$4.call(value) : '';
  return tag == funcTag$4 || tag == genTag$4;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$4(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$4;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$4(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$4(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$1(object) {
  return isArrayLike$4(object) ? arrayLikeKeys$2(object) : baseKeys$1(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys$1(object)) : [];
}

var lodash_sample = sample;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$5 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$5 = '[object Arguments]',
    funcTag$5 = '[object Function]',
    genTag$5 = '[object GeneratorFunction]';

/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$2 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal$2 || freeSelf$2 || Function('return this')();

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush$2(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$5 = objectProto$5.toString;

/** Built-in value references. */
var Symbol$3 = root$2.Symbol,
    propertyIsEnumerable$5 = objectProto$5.propertyIsEnumerable,
    spreadableSymbol$2 = Symbol$3 ? Symbol$3.isConcatSpreadable : undefined;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten$2(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable$2);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$2(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$2(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable$2(value) {
  return isArray$5(value) || isArguments$5(value) ||
    !!(spreadableSymbol$2 && value && value[spreadableSymbol$2]);
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten$2(array, 1) : [];
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$5(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$5(value) && hasOwnProperty$5.call(value, 'callee') &&
    (!propertyIsEnumerable$5.call(value, 'callee') || objectToString$5.call(value) == argsTag$5);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$5 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$5(value) {
  return value != null && isLength$5(value.length) && !isFunction$5(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$5(value) {
  return isObjectLike$5(value) && isArrayLike$5(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$5(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$5(value) ? objectToString$5.call(value) : '';
  return tag == funcTag$5 || tag == genTag$5;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$5(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$5;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$5(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$5(value) {
  return !!value && typeof value == 'object';
}

var lodash_flatten = flatten;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128,
    REARG_FLAG = 256,
    FLIP_FLAG = 512;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0,
    MAX_SAFE_INTEGER$6 = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', ARY_FLAG],
  ['bind', BIND_FLAG],
  ['bindKey', BIND_KEY_FLAG],
  ['curry', CURRY_FLAG],
  ['curryRight', CURRY_RIGHT_FLAG],
  ['flip', FLIP_FLAG],
  ['partial', PARTIAL_FLAG],
  ['partialRight', PARTIAL_RIGHT_FLAG],
  ['rearg', REARG_FLAG]
];

/** `Object#toString` result references. */
var funcTag$6 = '[object Function]',
    genTag$6 = '[object GeneratorFunction]',
    symbolTag$1 = '[object Symbol]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
    reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint$3 = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal$3 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$3 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$3 = freeGlobal$3 || freeSelf$3 || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply$3(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach$1(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$1(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf$1(array, value, 0) > -1;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$1(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex$1(array, baseIsNaN$1, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN$1(value) {
  return value !== value;
}

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      result++;
    }
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$1(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$6 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$3['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$1 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$6.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$6 = objectProto$6.toString;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' +
  funcToString$1.call(hasOwnProperty$6).replace(reRegExpChar$1, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var objectCreate = Object.create;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$3 = Math.max,
    nativeMin = Math.min;

/* Used to set `toString` methods. */
var defineProperty = (function() {
  var func = getNative$1(Object, 'defineProperty'),
      name = getNative$1.name;

  return (name && name.length > 2) ? func : undefined;
}());

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject$6(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$6(value) || isMasked$1(value)) {
    return false;
  }
  var pattern = (isFunction$6(value) || isHostObject$1(value)) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$1(value));
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$3(func, start) {
  start = nativeMax$3(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$3(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply$3(func, this, otherArgs);
  };
}

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax$3(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax$3(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var fn = (this && this !== root$3 && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject$6(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root$3 && this instanceof wrapper) ? Ctor : func;
    return apply$3(fn, this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
      isFlip = bitmask & FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root$3 && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root$3 && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply$3(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & CURRY_FLAG,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

  if (!(bitmask & CURRY_BOUND_FLAG)) {
    bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
  }

  var result = wrapFunc(func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity);
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 *   512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax$3(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null
    ? (isBindKey ? 0 : func.length)
    : nativeMax$3(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
    bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == BIND_FLAG) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }
  return setWrapToString(result, func, bitmask);
}

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : undefined;
}

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length,
      lastIndex = length - 1;

  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$3(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$6 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$3.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey$1 && (maskSrcKey$1 in func);
}

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex$3(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
var setWrapToString = !defineProperty ? identity$1 : function(wrapper, reference, bitmask) {
  var source = (reference + '');
  return defineProperty(wrapper, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)))
  });
};

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails(details, bitmask) {
  arrayEach$1(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes$1(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and `partials` prepended to the arguments it receives.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * function greet(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * }
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = baseRest$3(function(func, thisArg, partials) {
  var bitmask = BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= PARTIAL_FLAG;
  }
  return createWrap(func, bitmask, thisArg, partials, holders);
});

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$6(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$6(value) ? objectToString$6.call(value) : '';
  return tag == funcTag$6 || tag == genTag$6;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$6(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$6(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$6(value) && objectToString$6.call(value) == symbolTag$1);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$1 || value === -INFINITY$1) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol$1(value)) {
    return NAN;
  }
  if (isObject$6(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$6(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity$1(value) {
  return value;
}

// Assign default placeholders.
bind.placeholder = {};

var lodash_bind = bind;

var lodash_isempty = createCommonjsModule(function (module, exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' ||
        typeof value.splice == 'function' || isBuffer(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (nonEnumShadows || isPrototype(value)) {
    return !nativeKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEmpty;
});

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$7 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$6 = '[object Arguments]',
    funcTag$7 = '[object Function]',
    genTag$7 = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint$4 = /^(?:0|[1-9]\d*)$/;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$3(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$3(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues$1(object, props) {
  return arrayMap$3(props, function(key) {
    return object[key];
  });
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$7.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$7 = objectProto$7.toString;

/** Built-in value references. */
var propertyIsEnumerable$6 = objectProto$7.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys$2 = overArg$2(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$3(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$6(value) || isArguments$6(value))
    ? baseTimes$3(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex$4(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$2(object) {
  if (!isPrototype$3(object)) {
    return nativeKeys$2(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$4(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$7 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$4.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$3(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$7;

  return value === proto;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$6(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$6(value) && hasOwnProperty$7.call(value, 'callee') &&
    (!propertyIsEnumerable$6.call(value, 'callee') || objectToString$7.call(value) == argsTag$6);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$6 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$6(value) {
  return value != null && isLength$6(value.length) && !isFunction$7(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$6(value) {
  return isObjectLike$7(value) && isArrayLike$6(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$7(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$7(value) ? objectToString$7.call(value) : '';
  return tag == funcTag$7 || tag == genTag$7;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$6(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$7;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$7(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$7(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$2(object) {
  return isArrayLike$6(object) ? arrayLikeKeys$3(object) : baseKeys$2(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values$1(object) {
  return object ? baseValues$1(object, keys$2(object)) : [];
}

var lodash_values = values$1;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_SAFE_INTEGER$8 = 9007199254740991,
    MAX_INTEGER$1 = 1.7976931348623157e+308,
    NAN$1 = 0 / 0;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/** `Object#toString` result references. */
var argsTag$7 = '[object Arguments]',
    funcTag$8 = '[object Function]',
    genTag$8 = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$2 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match leading and trailing whitespace. */
var reTrim$1 = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary$1 = /^0b[01]+$/i;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$2 = /^\[object .+?Constructor\]$/;

/** Used to detect octal string values. */
var reIsOctal$1 = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint$5 = /^(?:0|[1-9]\d*)$/;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Built-in method references without a dependency on `root`. */
var freeParseInt$1 = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal$4 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$4 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$4 = freeGlobal$4 || freeSelf$4 || Function('return this')();

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$4(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$4(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues$2(object, props) {
  return arrayMap$4(props, function(key) {
    return object[key];
  });
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$2(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$3(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$8 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$2 = root$4['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$2 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$8.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$8 = objectProto$8.toString;

/** Used to detect if a method is native. */
var reIsNative$2 = RegExp('^' +
  funcToString$2.call(hasOwnProperty$8).replace(reRegExpChar$2, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$4 = root$4.Symbol,
    iteratorSymbol = Symbol$4 ? Symbol$4.iterator : undefined,
    propertyIsEnumerable$7 = objectProto$8.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor$1 = Math.floor,
    nativeKeys$3 = overArg$3(Object.keys, Object),
    nativeRandom$1 = Math.random;

/* Built-in method references that are verified to be native. */
var DataView = getNative$2(root$4, 'DataView'),
    Map$2 = getNative$2(root$4, 'Map'),
    Promise$1 = getNative$2(root$4, 'Promise'),
    Set = getNative$2(root$4, 'Set'),
    WeakMap = getNative$2(root$4, 'WeakMap');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource$2(DataView),
    mapCtorString = toSource$2(Map$2),
    promiseCtorString = toSource$2(Promise$1),
    setCtorString = toSource$2(Set),
    weakMapCtorString = toSource$2(WeakMap);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$4(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$7(value) || isArguments$7(value))
    ? baseTimes$4(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex$5(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString$8.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$2(value) {
  if (!isObject$8(value) || isMasked$2(value)) {
    return false;
  }
  var pattern = (isFunction$8(value) || isHostObject$2(value)) ? reIsNative$2 : reIsHostCtor$2;
  return pattern.test(toSource$2(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$3(object) {
  if (!isPrototype$4(object)) {
    return nativeKeys$3(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.random` without support for returning
 * floating-point numbers.
 *
 * @private
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the random number.
 */
function baseRandom$1(lower, upper) {
  return lower + nativeFloor$1(nativeRandom$1() * (upper - lower + 1));
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray$1(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$2(object, key) {
  var value = getValue$2(object, key);
  return baseIsNative$2(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map$2 && getTag(new Map$2) != mapTag) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString$8.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource$2(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$5(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$8 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$5.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall$1(value, index, object) {
  if (!isObject$8(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike$7(object) && isIndex$5(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq$2(object[index], value);
  }
  return false;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$2(func) {
  return !!maskSrcKey$2 && (maskSrcKey$2 in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$4(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Gets `n` random elements at unique keys from `collection` up to the
 * size of `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @param {number} [n=1] The number of elements to sample.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the random elements.
 * @example
 *
 * _.sampleSize([1, 2, 3], 2);
 * // => [3, 1]
 *
 * _.sampleSize([1, 2, 3], 4);
 * // => [2, 3, 1]
 */
function sampleSize(collection, n, guard) {
  var index = -1,
      result = toArray(collection),
      length = result.length,
      lastIndex = length - 1;

  if ((guard ? isIterateeCall$1(collection, n, guard) : n === undefined)) {
    n = 1;
  } else {
    n = baseClamp(toInteger$1(n), 0, length);
  }
  while (++index < n) {
    var rand = baseRandom$1(index, lastIndex),
        value = result[rand];

    result[rand] = result[index];
    result[index] = value;
  }
  result.length = n;
  return result;
}

/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * _.shuffle([1, 2, 3, 4]);
 * // => [4, 1, 3, 2]
 */
function shuffle(collection) {
  return sampleSize(collection, MAX_ARRAY_LENGTH);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$2(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$7(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$7(value) && hasOwnProperty$8.call(value, 'callee') &&
    (!propertyIsEnumerable$7.call(value, 'callee') || objectToString$8.call(value) == argsTag$7);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$7 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$7(value) {
  return value != null && isLength$7(value.length) && !isFunction$8(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$7(value) {
  return isObjectLike$8(value) && isArrayLike$7(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$8(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$8(value) ? objectToString$8.call(value) : '';
  return tag == funcTag$8 || tag == genTag$8;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$7(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$8;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$8(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$8(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray$7(value) && isObjectLike$8(value) && objectToString$8.call(value) == stringTag);
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$2(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$8(value) && objectToString$8.call(value) == symbolTag$2);
}

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike$7(value)) {
    return isString(value) ? stringToArray(value) : copyArray$1(value);
  }
  if (iteratorSymbol && value[iteratorSymbol]) {
    return iteratorToArray(value[iteratorSymbol]());
  }
  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values$2);

  return func(value);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite$1(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber$1(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER$1;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger$1(value) {
  var result = toFinite$1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol$2(value)) {
    return NAN$1;
  }
  if (isObject$8(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$8(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim$1, '');
  var isBinary = reIsBinary$1.test(value);
  return (isBinary || reIsOctal$1.test(value))
    ? freeParseInt$1(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex$1.test(value) ? NAN$1 : +value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$3(object) {
  return isArrayLike$7(object) ? arrayLikeKeys$4(object) : baseKeys$3(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values$2(object) {
  return object ? baseValues$2(object, keys$3(object)) : [];
}

var lodash_shuffle = shuffle;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used as the internal argument placeholder. */
var PLACEHOLDER$1 = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG$1 = 1,
    BIND_KEY_FLAG$1 = 2,
    CURRY_BOUND_FLAG$1 = 4,
    CURRY_FLAG$1 = 8,
    CURRY_RIGHT_FLAG$1 = 16,
    PARTIAL_FLAG$1 = 32,
    PARTIAL_RIGHT_FLAG$1 = 64,
    ARY_FLAG$1 = 128,
    REARG_FLAG$1 = 256,
    FLIP_FLAG$1 = 512;

/** Used as references for various `Number` constants. */
var INFINITY$3 = 1 / 0,
    MAX_SAFE_INTEGER$9 = 9007199254740991,
    MAX_INTEGER$2 = 1.7976931348623157e+308,
    NAN$2 = 0 / 0;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags$1 = [
  ['ary', ARY_FLAG$1],
  ['bind', BIND_FLAG$1],
  ['bindKey', BIND_KEY_FLAG$1],
  ['curry', CURRY_FLAG$1],
  ['curryRight', CURRY_RIGHT_FLAG$1],
  ['flip', FLIP_FLAG$1],
  ['partial', PARTIAL_FLAG$1],
  ['partialRight', PARTIAL_RIGHT_FLAG$1],
  ['rearg', REARG_FLAG$1]
];

/** `Object#toString` result references. */
var funcTag$9 = '[object Function]',
    genTag$9 = '[object GeneratorFunction]',
    symbolTag$3 = '[object Symbol]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$3 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match leading and trailing whitespace. */
var reTrim$2 = /^\s+|\s+$/g;

/** Used to match wrap detail comments. */
var reWrapComment$1 = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
    reWrapDetails$1 = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails$1 = /,? & /;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex$2 = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary$2 = /^0b[01]+$/i;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$3 = /^\[object .+?Constructor\]$/;

/** Used to detect octal string values. */
var reIsOctal$2 = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint$6 = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt$2 = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal$5 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$5 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$5 = freeGlobal$5 || freeSelf$5 || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply$4(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach$2(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$2(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf$2(array, value, 0) > -1;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex$2(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$2(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex$2(array, baseIsNaN$2, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN$2(value) {
  return value !== value;
}

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders$1(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      result++;
    }
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$3(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$3(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders$1(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER$1) {
      array[index] = PLACEHOLDER$1;
      result[resIndex++] = index;
    }
  }
  return result;
}

/** Used for built-in method references. */
var funcProto$3 = Function.prototype,
    objectProto$9 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$3 = root$5['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$3 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$3 && coreJsData$3.keys && coreJsData$3.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$3 = funcProto$3.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$9.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$9 = objectProto$9.toString;

/** Used to detect if a method is native. */
var reIsNative$3 = RegExp('^' +
  funcToString$3.call(hasOwnProperty$9).replace(reRegExpChar$3, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var objectCreate$1 = Object.create;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$4 = Math.max,
    nativeMin$1 = Math.min;

/* Used to set `toString` methods. */
var defineProperty$1 = (function() {
  var func = getNative$3(Object, 'defineProperty'),
      name = getNative$3.name;

  return (name && name.length > 2) ? func : undefined;
}());

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate$1(proto) {
  return isObject$9(proto) ? objectCreate$1(proto) : {};
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$3(value) {
  if (!isObject$9(value) || isMasked$3(value)) {
    return false;
  }
  var pattern = (isFunction$9(value) || isHostObject$3(value)) ? reIsNative$3 : reIsHostCtor$3;
  return pattern.test(toSource$3(value));
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$4(func, start) {
  start = nativeMax$4(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$4(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply$4(func, this, otherArgs);
  };
}

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs$1(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax$4(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight$1(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax$4(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray$2(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind$1(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG$1,
      Ctor = createCtor$1(func);

  function wrapper() {
    var fn = (this && this !== root$5 && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor$1(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate$1(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject$9(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry$1(func, bitmask, arity) {
  var Ctor = createCtor$1(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder$1(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders$1(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry$1(
        func, bitmask, createHybrid$1, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root$5 && this instanceof wrapper) ? Ctor : func;
    return apply$4(fn, this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid$1(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG$1,
      isBind = bitmask & BIND_FLAG$1,
      isBindKey = bitmask & BIND_KEY_FLAG$1,
      isCurried = bitmask & (CURRY_FLAG$1 | CURRY_RIGHT_FLAG$1),
      isFlip = bitmask & FLIP_FLAG$1,
      Ctor = isBindKey ? undefined : createCtor$1(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder$1(wrapper),
          holdersCount = countHolders$1(args, placeholder);
    }
    if (partials) {
      args = composeArgs$1(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight$1(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders$1(args, placeholder);
      return createRecurry$1(
        func, bitmask, createHybrid$1, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder$1(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root$5 && this instanceof wrapper) {
      fn = Ctor || createCtor$1(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial$1(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG$1,
      Ctor = createCtor$1(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root$5 && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply$4(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry$1(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & CURRY_FLAG$1,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? PARTIAL_FLAG$1 : PARTIAL_RIGHT_FLAG$1);
  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG$1 : PARTIAL_FLAG$1);

  if (!(bitmask & CURRY_BOUND_FLAG$1)) {
    bitmask &= ~(BIND_FLAG$1 | BIND_KEY_FLAG$1);
  }

  var result = wrapFunc(func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity);
  result.placeholder = placeholder;
  return setWrapToString$1(result, func, bitmask);
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 *   512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap$1(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG$1;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG$1 | PARTIAL_RIGHT_FLAG$1);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax$4(toInteger$2(ary), 0);
  arity = arity === undefined ? arity : toInteger$2(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG$1) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null
    ? (isBindKey ? 0 : func.length)
    : nativeMax$4(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG$1 | CURRY_RIGHT_FLAG$1)) {
    bitmask &= ~(CURRY_FLAG$1 | CURRY_RIGHT_FLAG$1);
  }
  if (!bitmask || bitmask == BIND_FLAG$1) {
    var result = createBind$1(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG$1 || bitmask == CURRY_RIGHT_FLAG$1) {
    result = createCurry$1(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG$1 || bitmask == (BIND_FLAG$1 | PARTIAL_FLAG$1)) && !holders.length) {
    result = createPartial$1(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid$1.apply(undefined, newData);
  }
  return setWrapToString$1(result, func, bitmask);
}

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder$1(func) {
  var object = func;
  return object.placeholder;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$3(object, key) {
  var value = getValue$3(object, key);
  return baseIsNative$3(value) ? value : undefined;
}

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails$1(source) {
  var match = source.match(reWrapDetails$1);
  return match ? match[1].split(reSplitDetails$1) : [];
}

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails$1(source, details) {
  var length = details.length,
      lastIndex = length - 1;

  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment$1, '{\n/* [wrapped with ' + details + '] */\n');
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$6(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$9 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint$6.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$3(func) {
  return !!maskSrcKey$3 && (maskSrcKey$3 in func);
}

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder$1(array, indexes) {
  var arrLength = array.length,
      length = nativeMin$1(indexes.length, arrLength),
      oldArray = copyArray$2(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex$6(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
var setWrapToString$1 = !defineProperty$1 ? identity$2 : function(wrapper, reference, bitmask) {
  var source = (reference + '');
  return defineProperty$1(wrapper, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant$1(insertWrapDetails$1(source, updateWrapDetails$1(getWrapDetails$1(source), bitmask)))
  });
};

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$3(func) {
  if (func != null) {
    try {
      return funcToString$3.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails$1(details, bitmask) {
  arrayEach$2(wrapFlags$1, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes$2(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

/**
 * Creates a function that invokes `func` with `partials` prepended to the
 * arguments it receives. This method is like `_.bind` except it does **not**
 * alter the `this` binding.
 *
 * The `_.partial.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 0.2.0
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * var sayHelloTo = _.partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 *
 * // Partially applied with placeholders.
 * var greetFred = _.partial(greet, _, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 */
var partial = baseRest$4(function(func, partials) {
  var holders = replaceHolders$1(partials, getHolder$1(partial));
  return createWrap$1(func, PARTIAL_FLAG$1, undefined, partials, holders);
});

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$9(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$9(value) ? objectToString$9.call(value) : '';
  return tag == funcTag$9 || tag == genTag$9;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$9(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$9(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$3(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$9(value) && objectToString$9.call(value) == symbolTag$3);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite$2(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber$2(value);
  if (value === INFINITY$3 || value === -INFINITY$3) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER$2;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger$2(value) {
  var result = toFinite$2(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$2(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol$3(value)) {
    return NAN$2;
  }
  if (isObject$9(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$9(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim$2, '');
  var isBinary = reIsBinary$2.test(value);
  return (isBinary || reIsOctal$2.test(value))
    ? freeParseInt$2(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex$2.test(value) ? NAN$2 : +value);
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant$1(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity$2(value) {
  return value;
}

// Assign default placeholders.
partial.placeholder = {};

var lodash_partial = partial;

var lodash_clonedeep = createCommonjsModule(function (module, exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer$$1, isDeep) {
  if (isDeep) {
    return buffer$$1.slice();
  }
  var result = new buffer$$1.constructor(buffer$$1.length);
  buffer$$1.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer$$1 = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer$$1, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer$$1 = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer$$1, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;
});

var forEach$1 = lodash_foreach;
var pick$1 = lodash_pick;
var defaults$1 = lodash_defaults;
var noop = function () { };
var difference$1 = lodash_difference;
var clone = lodash_clone;
var sample$1 = lodash_sample;
var flatten$1 = lodash_flatten;
var bind$1 = lodash_bind;
var isEmpty = lodash_isempty;
var values$3 = lodash_values;
var shuffle$1 = lodash_shuffle;
var partial$1 = lodash_partial;
var cloneDeep = lodash_clonedeep;

var lodash = {
	forEach: forEach$1,
	pick: pick$1,
	defaults: defaults$1,
	noop: noop,
	difference: difference$1,
	clone: clone,
	sample: sample$1,
	flatten: flatten$1,
	bind: bind$1,
	isEmpty: isEmpty,
	values: values$3,
	shuffle: shuffle$1,
	partial: partial$1,
	cloneDeep: cloneDeep
};

/**
 * Custom implementation of a double ended queue.
 */
function Denque(array) {
  this._head = 0;
  this._tail = 0;
  this._capacityMask = 0x3;
  this._list = new Array(4);
  if (Array.isArray(array)) {
    this._fromArray(array);
  }
}

/**
 * -------------
 *  PUBLIC API
 * -------------
 */

/**
 * Returns the item at the specified index from the list.
 * 0 is the first element, 1 is the second, and so on...
 * Elements at negative values are that many from the end: -1 is one before the end
 * (the last element), -2 is two before the end (one before last), etc.
 * @param index
 * @returns {*}
 */
Denque.prototype.peekAt = function peekAt(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var len = this.size();
  if (i >= len || i < -len) return undefined;
  if (i < 0) i += len;
  i = (this._head + i) & this._capacityMask;
  return this._list[i];
};

/**
 * Alias for peakAt()
 * @param i
 * @returns {*}
 */
Denque.prototype.get = function get(i) {
  return this.peekAt(i);
};

/**
 * Returns the first item in the list without removing it.
 * @returns {*}
 */
Denque.prototype.peek = function peek() {
  if (this._head === this._tail) return undefined;
  return this._list[this._head];
};

/**
 * Alias for peek()
 * @returns {*}
 */
Denque.prototype.peekFront = function peekFront() {
  return this.peek();
};

/**
 * Returns the item that is at the back of the queue without removing it.
 * Uses peekAt(-1)
 */
Denque.prototype.peekBack = function peekBack() {
  return this.peekAt(-1);
};

/**
 * Returns the current length of the queue
 * @return {Number}
 */
Object.defineProperty(Denque.prototype, 'length', {
  get: function length() {
    return this.size();
  }
});

/**
 * Return the number of items on the list, or 0 if empty.
 * @returns {number}
 */
Denque.prototype.size = function size() {
  if (this._head === this._tail) return 0;
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Add an item at the beginning of the list.
 * @param item
 */
Denque.prototype.unshift = function unshift(item) {
  if (item === undefined) return this.size();
  var len = this._list.length;
  this._head = (this._head - 1 + len) & this._capacityMask;
  this._list[this._head] = item;
  if (this._tail === this._head) this._growArray();
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the first item on the list,
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.shift = function shift() {
  var head = this._head;
  if (head === this._tail) return undefined;
  var item = this._list[head];
  this._list[head] = undefined;
  this._head = (head + 1) & this._capacityMask;
  if (head < 2 && this._tail > 10000 && this._tail <= this._list.length >>> 2) this._shrinkArray();
  return item;
};

/**
 * Add an item to the bottom of the list.
 * @param item
 */
Denque.prototype.push = function push(item) {
  if (item === undefined) return this.size();
  var tail = this._tail;
  this._list[tail] = item;
  this._tail = (tail + 1) & this._capacityMask;
  if (this._tail === this._head) {
    this._growArray();
  }

  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the last item on the list.
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.pop = function pop() {
  var tail = this._tail;
  if (tail === this._head) return undefined;
  var len = this._list.length;
  this._tail = (tail - 1 + len) & this._capacityMask;
  var item = this._list[this._tail];
  this._list[this._tail] = undefined;
  if (this._head < 2 && tail > 10000 && tail <= len >>> 2) this._shrinkArray();
  return item;
};

/**
 * Remove and return the item at the specified index from the list.
 * Returns undefined if the list is empty.
 * @param index
 * @returns {*}
 */
Denque.prototype.removeOne = function removeOne(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size) return void 0;
  if (i < 0) i += size;
  i = (this._head + i) & this._capacityMask;
  var item = this._list[i];
  var k;
  if (index < size / 2) {
    for (k = index; k > 0; k--) {
      this._list[i] = this._list[i = (i - 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._head = (this._head + 1 + len) & this._capacityMask;
  } else {
    for (k = size - 1 - index; k > 0; k--) {
      this._list[i] = this._list[i = ( i + 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._tail = (this._tail - 1 + len) & this._capacityMask;
  }
  return item;
};

/**
 * Remove number of items from the specified index from the list.
 * Returns array of removed items.
 * Returns undefined if the list is empty.
 * @param index
 * @param count
 * @returns {array}
 */
Denque.prototype.remove = function remove(index, count) {
  var i = index;
  var removed;
  var del_count = count;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size || count < 1) return void 0;
  if (i < 0) i += size;
  if (count === 1 || !count) {
    removed = new Array(1);
    removed[0] = this.removeOne(i);
    return removed;
  }
  if (i === 0 && i + count >= size) {
    removed = this.toArray();
    this.clear();
    return removed;
  }
  if (i + count > size) count = size - i;
  var k;
  removed = new Array(count);
  for (k = 0; k < count; k++) {
    removed[k] = this._list[(this._head + i + k) & this._capacityMask];
  }
  i = (this._head + i) & this._capacityMask;
  if (index + count === size) {
    this._tail = (this._tail - count + len) & this._capacityMask;
    for (k = count; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (index === 0) {
    this._head = (this._head + count + len) & this._capacityMask;
    for (k = count - 1; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (index < size / 2) {
    this._head = (this._head + index + count + len) & this._capacityMask;
    for (k = index; k > 0; k--) {
      this.unshift(this._list[i = (i - 1 + len) & this._capacityMask]);
    }
    i = (this._head - 1 + len) & this._capacityMask;
    while (del_count > 0) {
      this._list[i = (i - 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
  } else {
    this._tail = i;
    i = (i + count + len) & this._capacityMask;
    for (k = size - (count + index); k > 0; k--) {
      this.push(this._list[i++]);
    }
    i = this._tail;
    while (del_count > 0) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
  }
  if (this._head < 2 && this._tail > 10000 && this._tail <= len >>> 2) this._shrinkArray();
  return removed;
};

/**
 * Native splice implementation.
 * Remove number of items from the specified index from the list and/or add new elements.
 * Returns array of removed items or empty array if count == 0.
 * Returns undefined if the list is empty.
 *
 * @param index
 * @param count
 * @param {...*} [elements]
 * @returns {array}
 */
Denque.prototype.splice = function splice(index, count) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var size = this.size();
  if (i < 0) i += size;
  if (i > size) return void 0;
  if (arguments.length > 2) {
    var k;
    var temp;
    var removed;
    var arg_len = arguments.length;
    var len = this._list.length;
    var arguments_index = 2;
    if (!size || i < size / 2) {
      temp = new Array(i);
      for (k = 0; k < i; k++) {
        temp[k] = this._list[(this._head + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i > 0) {
          this._head = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._head = (this._head + i + len) & this._capacityMask;
      }
      while (arg_len > arguments_index) {
        this.unshift(arguments[--arg_len]);
      }
      for (k = i; k > 0; k--) {
        this.unshift(temp[k - 1]);
      }
    } else {
      temp = new Array(size - (i + count));
      var leng = temp.length;
      for (k = 0; k < leng; k++) {
        temp[k] = this._list[(this._head + i + count + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i != size) {
          this._tail = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._tail = (this._tail - leng + len) & this._capacityMask;
      }
      while (arguments_index < arg_len) {
        this.push(arguments[arguments_index++]);
      }
      for (k = 0; k < leng; k++) {
        this.push(temp[k]);
      }
    }
    return removed;
  } else {
    return this.remove(i, count);
  }
};

/**
 * Soft clear - does not reset capacity.
 */
Denque.prototype.clear = function clear() {
  this._head = 0;
  this._tail = 0;
};

/**
 * Returns true or false whether the list is empty.
 * @returns {boolean}
 */
Denque.prototype.isEmpty = function isEmpty() {
  return this._head === this._tail;
};

/**
 * Returns an array of all queue items.
 * @returns {Array}
 */
Denque.prototype.toArray = function toArray() {
  return this._copyArray(false);
};

/**
 * -------------
 *   INTERNALS
 * -------------
 */

/**
 * Fills the queue with items from an array
 * For use in the constructor
 * @param array
 * @private
 */
Denque.prototype._fromArray = function _fromArray(array) {
  for (var i = 0; i < array.length; i++) this.push(array[i]);
};

/**
 *
 * @param fullCopy
 * @returns {Array}
 * @private
 */
Denque.prototype._copyArray = function _copyArray(fullCopy) {
  var newArray = [];
  var list = this._list;
  var len = list.length;
  var i;
  if (fullCopy || this._head > this._tail) {
    for (i = this._head; i < len; i++) newArray.push(list[i]);
    for (i = 0; i < this._tail; i++) newArray.push(list[i]);
  } else {
    for (i = this._head; i < this._tail; i++) newArray.push(list[i]);
  }
  return newArray;
};

/**
 * Grows the internal list array.
 * @private
 */
Denque.prototype._growArray = function _growArray() {
  if (this._head) {
    // copy existing data, head to end, then beginning to tail.
    this._list = this._copyArray(true);
    this._head = 0;
  }

  // head is at 0 and array is now full, safe to extend
  this._tail = this._list.length;

  this._list.length *= 2;
  this._capacityMask = (this._capacityMask << 1) | 1;
};

/**
 * Shrinks the internal list array.
 * @private
 */
Denque.prototype._shrinkArray = function _shrinkArray() {
  this._list.length >>>= 1;
  this._capacityMask >>>= 1;
};


var denque = Denque;

function FlexBuffer(){
    this.originalArgs = arguments;
   
    if (arguments[0] && typeof arguments[0] === "number") 
        this.buffer = new Buffer (arguments[0]);
    else
        this.buffer = Buffer.call(this,arguments);
    this.length = this.buffer.length;
    this.tail = 0;
}

FlexBuffer.prototype.rewind = function(){
    this.tail = 0;
};

FlexBuffer.prototype.reset = function(){
    this.buffer = Buffer.call(this,this.originalArgs);
    this.length = this.buffer.length;
    this.tail = 0;
};

FlexBuffer.prototype.resizeBuffer = function(minLen){
    if(this.length == 0){
        this.length = 1;
    }
    this.length = (this.length + minLen) * 2;
    var oldBuffer = this.buffer;
    this.buffer = new Buffer(this.length);
    oldBuffer.copy(this.buffer,0, 0, this.tail);
};

FlexBuffer.prototype.write = function(arg){
    if(!arg)
        return;
    if(!arg.length){
        arg = String(arg);
    }

    if(typeof arg === "string")
       var len = Buffer.byteLength(arg);
    else
       var len = arg.length;

    if(this.tail+len >= this.length)
        this.resizeBuffer(len);

    if(Buffer.isBuffer(arg)){
        arg.copy(this.buffer,this.tail);
    }else{
        this.buffer.write(arg,this.tail);
    }
    this.tail+=len;   
};

FlexBuffer.prototype.getBufferReference = function(){
    return this.buffer.slice(0,this.tail)
};

FlexBuffer.prototype.getBuffer = function(){
    var buff = this.buffer.slice(0,this.tail);
    var b = new Buffer(buff.length);
    buff.copy(b);
    return b
};

FlexBuffer.prototype.delete = function(start, end) {
    checkParams(start, end, this.tail);
    var copy = this.buffer.slice(end, this.tail).copy(this.buffer, start);
    this.tail = this.tail - end + start;
};

var checkParams = function (start, end, size) {
	if (end > size || start > size || start < 0 || end < 0 || start > end) {
		  throw new Error("Start and end not valid. start:["+start+"], end:["+end+"], size:["+size+"]");	
	}

};

FlexBuffer.prototype.deleteAndGet = function(start, end) {
    var b = new Buffer(end - start);
    this.buffer.slice(start, end).copy(b);
    this.delete(start, end);
    return b;
};

FlexBuffer.prototype.getLength = function() {
	return this.tail
};

FlexBuffer.prototype.getBufferLength = function() {
	return this.buffer.length;
};

var FlexBuffer_1 = FlexBuffer;

var flexbuffer = {
	FlexBuffer: FlexBuffer_1
};

var utils = createCommonjsModule(function (module, exports) {


/**
 * Test if two buffers are equal
 *
 * @param {Buffer} a
 * @param {Buffer} b
 * @return {Boolean} Whether the two buffers are equal
 * @private
 */
exports.bufferEqual = function (a, b) {
    if (typeof a.equals === 'function') {
        return a.equals(b);
    }
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};
/**
 * Convert a buffer to string, supports buffer array
 *
 * @param {*} value - The input value
 * @param {string} encoding - string encoding
 * @return {*} The result
 * @example
 * ```js
 * var input = [Buffer.from('foo'), [Buffer.from('bar')]];
 * var res = convertBufferToString(input, 'utf8');
 * expect(res).to.eql(['foo', ['bar']]);
 * ```
 * @private
 */
exports.convertBufferToString = function (value, encoding) {
    if (value instanceof Buffer) {
        return value.toString(encoding);
    }
    if (Array.isArray(value)) {
        var length = value.length;
        var res = Array(length);
        for (var i = 0; i < length; ++i) {
            res[i] = value[i] instanceof Buffer && encoding === 'utf8'
                ? value[i].toString()
                : exports.convertBufferToString(value[i], encoding);
        }
        return res;
    }
    return value;
};
/**
 * Convert a list of results to node-style
 *
 * @param {Array} arr - The input value
 * @return {Array} The output value
 * @example
 * ```js
 * var input = ['a', 'b', new Error('c'), 'd'];
 * var output = exports.wrapMultiResult(input);
 * expect(output).to.eql([[null, 'a'], [null, 'b'], [new Error('c')], [null, 'd']);
 * ```
 * @private
 */
exports.wrapMultiResult = function (arr) {
    // When using WATCH/EXEC transactions, the EXEC will return
    // a null instead of an array
    if (!arr) {
        return null;
    }
    var result = [];
    var length = arr.length;
    for (var i = 0; i < length; ++i) {
        var item = arr[i];
        if (item instanceof Error) {
            result.push([item]);
        }
        else {
            result.push([null, item]);
        }
    }
    return result;
};
/**
 * Detect the argument is a int
 *
 * @param {string} value
 * @return {boolean} Whether the value is a int
 * @example
 * ```js
 * > isInt('123')
 * true
 * > isInt('123.3')
 * false
 * > isInt('1x')
 * false
 * > isInt(123)
 * true
 * > isInt(true)
 * false
 * ```
 * @private
 */
exports.isInt = function (value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
};
/**
 * Pack an array to an Object
 *
 * @param {array} array
 * @return {object}
 * @example
 * ```js
 * > packObject(['a', 'b', 'c', 'd'])
 * { a: 'b', c: 'd' }
 * ```
 */
exports.packObject = function (array) {
    var result = {};
    var length = array.length;
    for (var i = 1; i < length; i += 2) {
        result[array[i - 1]] = array[i];
    }
    return result;
};
/**
 * Return a callback with timeout
 *
 * @param {function} callback
 * @param {number} timeout
 * @return {function}
 */
exports.timeout = function (callback, timeout) {
    var timer;
    var run = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            callback.apply(this, arguments);
        }
    };
    timer = setTimeout(run, timeout, new Error('timeout'));
    return run;
};
/**
 * Convert an object to an array
 *
 * @param {object} obj
 * @return {array}
 * @example
 * ```js
 * > convertObjectToArray({ a: '1' })
 * ['a', '1']
 * ```
 */
exports.convertObjectToArray = function (obj) {
    var result = [];
    var keys = Object.keys(obj);
    for (var i = 0, l = keys.length; i < l; i++) {
        result.push(keys[i], obj[keys[i]]);
    }
    return result;
};
/**
 * Convert a map to an array
 *
 * @param {Map} map
 * @return {array}
 * @example
 * ```js
 * > convertObjectToArray(new Map([[1, '2']]))
 * [1, '2']
 * ```
 */
exports.convertMapToArray = function (map) {
    var result = [];
    var pos = 0;
    map.forEach(function (value, key) {
        result[pos] = key;
        result[pos + 1] = value;
        pos += 2;
    });
    return result;
};
/**
 * Convert a non-string arg to a string
 *
 * @param {*} arg
 * @return {string}
 */
exports.toArg = function (arg) {
    if (arg === null || typeof arg === 'undefined') {
        return '';
    }
    return String(arg);
};
/**
 * Optimize error stack
 *
 * @param {Error} error - actually error
 * @param {string} friendlyStack - the stack that more meaningful
 * @param {string} filterPath - only show stacks with the specified path
 */
exports.optimizeErrorStack = function (error, friendlyStack, filterPath) {
    var stacks = friendlyStack.split('\n');
    var lines = '';
    var i;
    for (i = 1; i < stacks.length; ++i) {
        if (stacks[i].indexOf(filterPath) === -1) {
            break;
        }
    }
    for (var j = i; j < stacks.length; ++j) {
        lines += '\n' + stacks[j];
    }
    var pos = error.stack.indexOf('\n');
    error.stack = error.stack.slice(0, pos) + lines;
    return error;
};
/**
 * Parse the redis protocol url
 *
 * @param {string} url - the redis protocol url
 * @return {Object}
 */
exports.parseURL = function (url$$1) {
    if (exports.isInt(url$$1)) {
        return { port: url$$1 };
    }
    var parsed = url.parse(url$$1, true, true);
    if (!parsed.slashes && url$$1[0] !== '/') {
        url$$1 = '//' + url$$1;
        parsed = url.parse(url$$1, true, true);
    }
    var result = {};
    if (parsed.auth) {
        result.password = parsed.auth.split(':')[1];
    }
    if (parsed.pathname) {
        if (parsed.protocol === 'redis:') {
            if (parsed.pathname.length > 1) {
                result.db = parsed.pathname.slice(1);
            }
        }
        else {
            result.path = parsed.pathname;
        }
    }
    if (parsed.host) {
        result.host = parsed.hostname;
    }
    if (parsed.port) {
        result.port = parsed.port;
    }
    lodash.defaults(result, parsed.query);
    return result;
};
/**
 * Get a random element from `array`
 *
 * @param {array} array - the array
 * @param {number} [from=0] - start index
 * @return {}
 */
exports.sample = function (array, from) {
    var length = array.length;
    if (typeof from !== 'number') {
        from = 0;
    }
    if (from >= length) {
        return;
    }
    return array[from + Math.floor(Math.random() * (length - from))];
};
/**
 * Error message for connection being disconnected
 */
exports.CONNECTION_CLOSED_ERROR_MSG = 'Connection is closed.';
});
var utils_1 = utils.bufferEqual;
var utils_2 = utils.convertBufferToString;
var utils_3 = utils.wrapMultiResult;
var utils_4 = utils.isInt;
var utils_5 = utils.packObject;
var utils_6 = utils.timeout;
var utils_7 = utils.convertObjectToArray;
var utils_8 = utils.convertMapToArray;
var utils_9 = utils.toArg;
var utils_10 = utils.optimizeErrorStack;
var utils_11 = utils.parseURL;
var utils_12 = utils.sample;
var utils_13 = utils.CONNECTION_CLOSED_ERROR_MSG;

var append = {
	arity: 3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var asking = {
	arity: 1,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var auth = {
	arity: 2,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var bgrewriteaof = {
	arity: 1,
	flags: [
		"admin"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var bgsave = {
	arity: -1,
	flags: [
		"admin"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var bitcount = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var bitfield = {
	arity: -2,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var bitop = {
	arity: -4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 2,
	keyStop: -1,
	step: 1
};
var bitpos = {
	arity: -3,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var blpop = {
	arity: -3,
	flags: [
		"write",
		"noscript"
	],
	keyStart: 1,
	keyStop: -2,
	step: 1
};
var brpop = {
	arity: -3,
	flags: [
		"write",
		"noscript"
	],
	keyStart: 1,
	keyStop: -2,
	step: 1
};
var brpoplpush = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"noscript"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var client = {
	arity: -2,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var cluster = {
	arity: -2,
	flags: [
		"admin"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var command = {
	arity: 1,
	flags: [
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var config = {
	arity: -2,
	flags: [
		"admin",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var dbsize = {
	arity: 1,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var debug = {
	arity: -1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var decr = {
	arity: 2,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var decrby = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var del = {
	arity: -2,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var discard = {
	arity: 1,
	flags: [
		"noscript",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var dump = {
	arity: 2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var echo = {
	arity: 2,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var evalsha = {
	arity: -3,
	flags: [
		"noscript",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var exec = {
	arity: 1,
	flags: [
		"noscript",
		"skip_monitor"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var exists = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var expire = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var expireat = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var flushall = {
	arity: -1,
	flags: [
		"write"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var flushdb = {
	arity: -1,
	flags: [
		"write"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var geoadd = {
	arity: -5,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geodist = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geohash = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geopos = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadius = {
	arity: -6,
	flags: [
		"write",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadius_ro = {
	arity: -6,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadiusbymember = {
	arity: -5,
	flags: [
		"write",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadiusbymember_ro = {
	arity: -5,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var get = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getbit = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getrange = {
	arity: 4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getset = {
	arity: 3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hdel = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hexists = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hget = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hgetall = {
	arity: 2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hincrby = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hincrbyfloat = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hkeys = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hlen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hmget = {
	arity: -3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hmset = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hscan = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hset = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hsetnx = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hstrlen = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hvals = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var incr = {
	arity: 2,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var incrby = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var incrbyfloat = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var info = {
	arity: -1,
	flags: [
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var keys$4 = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var lastsave = {
	arity: 1,
	flags: [
		"random",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var latency = {
	arity: -2,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var lindex = {
	arity: 3,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var linsert = {
	arity: 5,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var llen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lpop = {
	arity: 2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lpush = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lpushx = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lrange = {
	arity: 4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lrem = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lset = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var ltrim = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var memory = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var mget = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var migrate = {
	arity: -6,
	flags: [
		"write",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var module$1 = {
	arity: -2,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var monitor = {
	arity: 1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var move = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var mset = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 2
};
var msetnx = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 2
};
var multi = {
	arity: 1,
	flags: [
		"noscript",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var object = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 2,
	keyStop: 2,
	step: 2
};
var persist = {
	arity: 2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pexpire = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pexpireat = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pfadd = {
	arity: -2,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pfcount = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var pfdebug = {
	arity: -3,
	flags: [
		"write"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var pfmerge = {
	arity: -2,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var pfselftest = {
	arity: 1,
	flags: [
		"admin"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var ping = {
	arity: -1,
	flags: [
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var post = {
	arity: -1,
	flags: [
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var psetex = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var psubscribe = {
	arity: -2,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var psync = {
	arity: 3,
	flags: [
		"readonly",
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var pttl = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var publish = {
	arity: 3,
	flags: [
		"pubsub",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var pubsub = {
	arity: -2,
	flags: [
		"pubsub",
		"random",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var punsubscribe = {
	arity: -1,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var quit = {
	arity: 1,
	flags: [
		"loading",
		"stale",
		"readonly"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var randomkey = {
	arity: 1,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var readonly = {
	arity: 1,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var readwrite = {
	arity: 1,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var rename = {
	arity: 3,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var renamenx = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var replconf = {
	arity: -1,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var restore = {
	arity: -4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var role = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var rpop = {
	arity: 2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var rpoplpush = {
	arity: 3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var rpush = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var rpushx = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var sadd = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var save$1 = {
	arity: 1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var scan = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var scard = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var script = {
	arity: -2,
	flags: [
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var sdiff = {
	arity: -2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sdiffstore = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var select = {
	arity: 2,
	flags: [
		"loading",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var set$1 = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setbit = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setex = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setnx = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setrange = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var shutdown = {
	arity: -1,
	flags: [
		"admin",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var sinter = {
	arity: -2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sinterstore = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sismember = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var slaveof = {
	arity: 3,
	flags: [
		"admin",
		"noscript",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var slowlog = {
	arity: -2,
	flags: [
		"admin"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var smembers = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var smove = {
	arity: 4,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var sort = {
	arity: -2,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var spop = {
	arity: -2,
	flags: [
		"write",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var srandmember = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var srem = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var sscan = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var strlen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var subscribe = {
	arity: -2,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var substr = {
	arity: 4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var sunion = {
	arity: -2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sunionstore = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var swapdb = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var sync = {
	arity: 1,
	flags: [
		"readonly",
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var time = {
	arity: 1,
	flags: [
		"random",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var touch = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var ttl = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var type = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var unlink = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var unsubscribe = {
	arity: -1,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var unwatch = {
	arity: 1,
	flags: [
		"noscript",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var wait = {
	arity: 3,
	flags: [
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var watch = {
	arity: -2,
	flags: [
		"noscript",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var zadd = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zcard = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zcount = {
	arity: 4,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zincrby = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zinterstore = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var zlexcount = {
	arity: 4,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrange = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrangebylex = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrangebyscore = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrank = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrem = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zremrangebylex = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zremrangebyrank = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zremrangebyscore = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrange = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrangebylex = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrangebyscore = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrank = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zscan = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zscore = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zunionstore = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var commands = {
	append: append,
	asking: asking,
	auth: auth,
	bgrewriteaof: bgrewriteaof,
	bgsave: bgsave,
	bitcount: bitcount,
	bitfield: bitfield,
	bitop: bitop,
	bitpos: bitpos,
	blpop: blpop,
	brpop: brpop,
	brpoplpush: brpoplpush,
	client: client,
	cluster: cluster,
	command: command,
	config: config,
	dbsize: dbsize,
	debug: debug,
	decr: decr,
	decrby: decrby,
	del: del,
	discard: discard,
	dump: dump,
	echo: echo,
	"eval": {
	arity: -3,
	flags: [
		"noscript",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
},
	evalsha: evalsha,
	exec: exec,
	exists: exists,
	expire: expire,
	expireat: expireat,
	flushall: flushall,
	flushdb: flushdb,
	geoadd: geoadd,
	geodist: geodist,
	geohash: geohash,
	geopos: geopos,
	georadius: georadius,
	georadius_ro: georadius_ro,
	georadiusbymember: georadiusbymember,
	georadiusbymember_ro: georadiusbymember_ro,
	get: get,
	getbit: getbit,
	getrange: getrange,
	getset: getset,
	hdel: hdel,
	hexists: hexists,
	hget: hget,
	hgetall: hgetall,
	hincrby: hincrby,
	hincrbyfloat: hincrbyfloat,
	hkeys: hkeys,
	hlen: hlen,
	hmget: hmget,
	hmset: hmset,
	"host:": {
	arity: -1,
	flags: [
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
},
	hscan: hscan,
	hset: hset,
	hsetnx: hsetnx,
	hstrlen: hstrlen,
	hvals: hvals,
	incr: incr,
	incrby: incrby,
	incrbyfloat: incrbyfloat,
	info: info,
	keys: keys$4,
	lastsave: lastsave,
	latency: latency,
	lindex: lindex,
	linsert: linsert,
	llen: llen,
	lpop: lpop,
	lpush: lpush,
	lpushx: lpushx,
	lrange: lrange,
	lrem: lrem,
	lset: lset,
	ltrim: ltrim,
	memory: memory,
	mget: mget,
	migrate: migrate,
	module: module$1,
	monitor: monitor,
	move: move,
	mset: mset,
	msetnx: msetnx,
	multi: multi,
	object: object,
	persist: persist,
	pexpire: pexpire,
	pexpireat: pexpireat,
	pfadd: pfadd,
	pfcount: pfcount,
	pfdebug: pfdebug,
	pfmerge: pfmerge,
	pfselftest: pfselftest,
	ping: ping,
	post: post,
	psetex: psetex,
	psubscribe: psubscribe,
	psync: psync,
	pttl: pttl,
	publish: publish,
	pubsub: pubsub,
	punsubscribe: punsubscribe,
	quit: quit,
	randomkey: randomkey,
	readonly: readonly,
	readwrite: readwrite,
	rename: rename,
	renamenx: renamenx,
	replconf: replconf,
	restore: restore,
	"restore-asking": {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"asking"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
},
	role: role,
	rpop: rpop,
	rpoplpush: rpoplpush,
	rpush: rpush,
	rpushx: rpushx,
	sadd: sadd,
	save: save$1,
	scan: scan,
	scard: scard,
	script: script,
	sdiff: sdiff,
	sdiffstore: sdiffstore,
	select: select,
	set: set$1,
	setbit: setbit,
	setex: setex,
	setnx: setnx,
	setrange: setrange,
	shutdown: shutdown,
	sinter: sinter,
	sinterstore: sinterstore,
	sismember: sismember,
	slaveof: slaveof,
	slowlog: slowlog,
	smembers: smembers,
	smove: smove,
	sort: sort,
	spop: spop,
	srandmember: srandmember,
	srem: srem,
	sscan: sscan,
	strlen: strlen,
	subscribe: subscribe,
	substr: substr,
	sunion: sunion,
	sunionstore: sunionstore,
	swapdb: swapdb,
	sync: sync,
	time: time,
	touch: touch,
	ttl: ttl,
	type: type,
	unlink: unlink,
	unsubscribe: unsubscribe,
	unwatch: unwatch,
	wait: wait,
	watch: watch,
	zadd: zadd,
	zcard: zcard,
	zcount: zcount,
	zincrby: zincrby,
	zinterstore: zinterstore,
	zlexcount: zlexcount,
	zrange: zrange,
	zrangebylex: zrangebylex,
	zrangebyscore: zrangebyscore,
	zrank: zrank,
	zrem: zrem,
	zremrangebylex: zremrangebylex,
	zremrangebyrank: zremrangebyrank,
	zremrangebyscore: zremrangebyscore,
	zrevrange: zrevrange,
	zrevrangebylex: zrevrangebylex,
	zrevrangebyscore: zrevrangebyscore,
	zrevrank: zrevrank,
	zscan: zscan,
	zscore: zscore,
	zunionstore: zunionstore
};

var commands$1 = /*#__PURE__*/Object.freeze({
	append: append,
	asking: asking,
	auth: auth,
	bgrewriteaof: bgrewriteaof,
	bgsave: bgsave,
	bitcount: bitcount,
	bitfield: bitfield,
	bitop: bitop,
	bitpos: bitpos,
	blpop: blpop,
	brpop: brpop,
	brpoplpush: brpoplpush,
	client: client,
	cluster: cluster,
	command: command,
	config: config,
	dbsize: dbsize,
	debug: debug,
	decr: decr,
	decrby: decrby,
	del: del,
	discard: discard,
	dump: dump,
	echo: echo,
	evalsha: evalsha,
	exec: exec,
	exists: exists,
	expire: expire,
	expireat: expireat,
	flushall: flushall,
	flushdb: flushdb,
	geoadd: geoadd,
	geodist: geodist,
	geohash: geohash,
	geopos: geopos,
	georadius: georadius,
	georadius_ro: georadius_ro,
	georadiusbymember: georadiusbymember,
	georadiusbymember_ro: georadiusbymember_ro,
	get: get,
	getbit: getbit,
	getrange: getrange,
	getset: getset,
	hdel: hdel,
	hexists: hexists,
	hget: hget,
	hgetall: hgetall,
	hincrby: hincrby,
	hincrbyfloat: hincrbyfloat,
	hkeys: hkeys,
	hlen: hlen,
	hmget: hmget,
	hmset: hmset,
	hscan: hscan,
	hset: hset,
	hsetnx: hsetnx,
	hstrlen: hstrlen,
	hvals: hvals,
	incr: incr,
	incrby: incrby,
	incrbyfloat: incrbyfloat,
	info: info,
	keys: keys$4,
	lastsave: lastsave,
	latency: latency,
	lindex: lindex,
	linsert: linsert,
	llen: llen,
	lpop: lpop,
	lpush: lpush,
	lpushx: lpushx,
	lrange: lrange,
	lrem: lrem,
	lset: lset,
	ltrim: ltrim,
	memory: memory,
	mget: mget,
	migrate: migrate,
	module: module$1,
	monitor: monitor,
	move: move,
	mset: mset,
	msetnx: msetnx,
	multi: multi,
	object: object,
	persist: persist,
	pexpire: pexpire,
	pexpireat: pexpireat,
	pfadd: pfadd,
	pfcount: pfcount,
	pfdebug: pfdebug,
	pfmerge: pfmerge,
	pfselftest: pfselftest,
	ping: ping,
	post: post,
	psetex: psetex,
	psubscribe: psubscribe,
	psync: psync,
	pttl: pttl,
	publish: publish,
	pubsub: pubsub,
	punsubscribe: punsubscribe,
	quit: quit,
	randomkey: randomkey,
	readonly: readonly,
	readwrite: readwrite,
	rename: rename,
	renamenx: renamenx,
	replconf: replconf,
	restore: restore,
	role: role,
	rpop: rpop,
	rpoplpush: rpoplpush,
	rpush: rpush,
	rpushx: rpushx,
	sadd: sadd,
	save: save$1,
	scan: scan,
	scard: scard,
	script: script,
	sdiff: sdiff,
	sdiffstore: sdiffstore,
	select: select,
	set: set$1,
	setbit: setbit,
	setex: setex,
	setnx: setnx,
	setrange: setrange,
	shutdown: shutdown,
	sinter: sinter,
	sinterstore: sinterstore,
	sismember: sismember,
	slaveof: slaveof,
	slowlog: slowlog,
	smembers: smembers,
	smove: smove,
	sort: sort,
	spop: spop,
	srandmember: srandmember,
	srem: srem,
	sscan: sscan,
	strlen: strlen,
	subscribe: subscribe,
	substr: substr,
	sunion: sunion,
	sunionstore: sunionstore,
	swapdb: swapdb,
	sync: sync,
	time: time,
	touch: touch,
	ttl: ttl,
	type: type,
	unlink: unlink,
	unsubscribe: unsubscribe,
	unwatch: unwatch,
	wait: wait,
	watch: watch,
	zadd: zadd,
	zcard: zcard,
	zcount: zcount,
	zincrby: zincrby,
	zinterstore: zinterstore,
	zlexcount: zlexcount,
	zrange: zrange,
	zrangebylex: zrangebylex,
	zrangebyscore: zrangebyscore,
	zrank: zrank,
	zrem: zrem,
	zremrangebylex: zremrangebylex,
	zremrangebyrank: zremrangebyrank,
	zremrangebyscore: zremrangebyscore,
	zrevrange: zrevrange,
	zrevrangebylex: zrevrangebylex,
	zrevrangebyscore: zrevrangebyscore,
	zrevrank: zrevrank,
	zscan: zscan,
	zscore: zscore,
	zunionstore: zunionstore,
	default: commands
});

var commands$2 = ( commands$1 && commands ) || commands$1;

var redisCommands = createCommonjsModule(function (module, exports) {



/**
 * Redis command list
 *
 * All commands are lowercased.
 *
 * @var {string[]}
 * @public
 */
exports.list = Object.keys(commands$2);

var flags = {};
exports.list.forEach(function (commandName) {
  flags[commandName] = commands$2[commandName].flags.reduce(function (flags, flag) {
    flags[flag] = true;
    return flags
  }, {});
});
/**
 * Check if the command exists
 *
 * @param {string} commandName - the command name
 * @return {boolean} result
 * @public
 */
exports.exists = function (commandName) {
  return Boolean(commands$2[commandName])
};

/**
 * Check if the command has the flag
 *
 * Some of possible flags: readonly, noscript, loading
 * @param {string} commandName - the command name
 * @param {string} flag - the flag to check
 * @return {boolean} result
 * @public
 */
exports.hasFlag = function (commandName, flag) {
  if (!flags[commandName]) {
    throw new Error('Unknown command ' + commandName)
  }

  return Boolean(flags[commandName][flag])
};

/**
 * Get indexes of keys in the command arguments
 *
 * @param {string} commandName - the command name
 * @param {string[]} args - the arguments of the command
 * @param {object} [options] - options
 * @param {boolean} [options.parseExternalKey] - parse external keys
 * @return {number[]} - the list of the index
 * @public
 *
 * @example
 * ```javascript
 * getKeyIndexes('set', ['key', 'value']) // [0]
 * getKeyIndexes('mget', ['key1', 'key2']) // [0, 1]
 * ```
 */
exports.getKeyIndexes = function (commandName, args, options) {
  var command = commands$2[commandName];
  if (!command) {
    throw new Error('Unknown command ' + commandName)
  }

  if (!Array.isArray(args)) {
    throw new Error('Expect args to be an array')
  }

  var keys = [];
  var i, keyStart, keyStop, parseExternalKey;
  switch (commandName) {
    case 'zunionstore':
    case 'zinterstore':
      keys.push(0);
    // fall through
    case 'eval':
    case 'evalsha':
      keyStop = Number(args[1]) + 2;
      for (i = 2; i < keyStop; i++) {
        keys.push(i);
      }
      break
    case 'sort':
      parseExternalKey = options && options.parseExternalKey;
      keys.push(0);
      for (i = 1; i < args.length - 1; i++) {
        if (typeof args[i] !== 'string') {
          continue
        }
        var directive = args[i].toUpperCase();
        if (directive === 'GET') {
          i += 1;
          if (args[i] !== '#') {
            if (parseExternalKey) {
              keys.push([i, getExternalKeyNameLength(args[i])]);
            } else {
              keys.push(i);
            }
          }
        } else if (directive === 'BY') {
          i += 1;
          if (parseExternalKey) {
            keys.push([i, getExternalKeyNameLength(args[i])]);
          } else {
            keys.push(i);
          }
        } else if (directive === 'STORE') {
          i += 1;
          keys.push(i);
        }
      }
      break
    case 'migrate':
      if (args[2] === '') {
        for (i = 5; i < args.length - 1; i++) {
          if (args[i].toUpperCase() === 'KEYS') {
            for (var j = i + 1; j < args.length; j++) {
              keys.push(j);
            }
            break
          }
        }
      } else {
        keys.push(2);
      }
      break
    default:
    // step has to be at least one in this case, otherwise the command does not contain a key
      if (command.step > 0) {
        keyStart = command.keyStart - 1;
        keyStop = command.keyStop > 0 ? command.keyStop : args.length + command.keyStop + 1;
        for (i = keyStart; i < keyStop; i += command.step) {
          keys.push(i);
        }
      }
      break
  }

  return keys
};

function getExternalKeyNameLength (key) {
  if (typeof key !== 'string') {
    key = String(key);
  }
  var hashPos = key.indexOf('->');
  return hashPos === -1 ? key.length : hashPos
}
});
var redisCommands_1 = redisCommands.list;
var redisCommands_2 = redisCommands.exists;
var redisCommands_3 = redisCommands.hasFlag;
var redisCommands_4 = redisCommands.getKeyIndexes;

var lib = createCommonjsModule(function (module) {
/*
 * Copyright 2001-2010 Georges Menie (www.menie.org)
 * Copyright 2010 Salvatore Sanfilippo (adapted to Redis coding style)
 * Copyright 2015 Zihua Li (http://zihua.li) (ported to JavaScript)
 * Copyright 2016 Mike Diarmid (http://github.com/salakar) (re-write for performance, ~700% perf inc)
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the University of California, Berkeley nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* CRC16 implementation according to CCITT standards.
 *
 * Note by @antirez: this is actually the XMODEM CRC 16 algorithm, using the
 * following parameters:
 *
 * Name                       : "XMODEM", also known as "ZMODEM", "CRC-16/ACORN"
 * Width                      : 16 bit
 * Poly                       : 1021 (That is actually x^16 + x^12 + x^5 + 1)
 * Initialization             : 0000
 * Reflect Input byte         : False
 * Reflect Output CRC         : False
 * Xor constant to output CRC : 0000
 * Output for "123456789"     : 31C3
 */

var lookup = [
  0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
  0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
  0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
  0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
  0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
  0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
  0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
  0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
  0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
  0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
  0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
  0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
  0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
  0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
  0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
  0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
  0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
  0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
  0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
  0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
  0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
  0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
  0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
  0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
  0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
  0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
  0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
  0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
  0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
  0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
  0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
  0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
];

/**
 * Convert a string to a UTF8 array - faster than via buffer
 * @param str
 * @returns {Array}
 */
var toUTF8Array = function toUTF8Array(str) {
  var char;
  var i = 0;
  var p = 0;
  var utf8 = [];
  var len = str.length;

  for (; i < len; i++) {
    char = str.charCodeAt(i);
    if (char < 128) {
      utf8[p++] = char;
    } else if (char < 2048) {
      utf8[p++] = (char >> 6) | 192;
      utf8[p++] = (char & 63) | 128;
    } else if (
        ((char & 0xFC00) === 0xD800) && (i + 1) < str.length &&
        ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      char = 0x10000 + ((char & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      utf8[p++] = (char >> 18) | 240;
      utf8[p++] = ((char >> 12) & 63) | 128;
      utf8[p++] = ((char >> 6) & 63) | 128;
      utf8[p++] = (char & 63) | 128;
    } else {
      utf8[p++] = (char >> 12) | 224;
      utf8[p++] = ((char >> 6) & 63) | 128;
      utf8[p++] = (char & 63) | 128;
    }
  }

  return utf8;
};

/**
 * Convert a string into a redis slot hash.
 * @param str
 * @returns {number}
 */
var generate = module.exports = function generate(str) {
  var char;
  var i = 0;
  var start = -1;
  var result = 0;
  var resultHash = 0;
  var utf8 = toUTF8Array(str);
  var len = utf8.length;

  while (i < len) {
    char = utf8[i++];
    if (start === -1) {
      if (char === 0x7B) {
        start = i;
      }
    } else if (char !== 0x7D) {
      resultHash = lookup[(char ^ (resultHash >> 8)) & 0xFF] ^ (resultHash << 8);
    } else if (i - 1 !== start) {
      return resultHash & 0x3FFF;
    }

    result = lookup[(char ^ (result >> 8)) & 0xFF] ^ (result << 8);
  }

  return result & 0x3FFF;
};

/**
 * Convert an array of multiple strings into a redis slot hash.
 * Returns -1 if one of the keys is not for the same slot as the others
 * @param keys
 * @returns {number}
 */
module.exports.generateMulti = function generateMulti(keys) {
  var i = 1;
  var len = keys.length;
  var base = generate(keys[0]);

  while (i < len) {
    if (generate(keys[i++]) !== base) return -1;
  }

  return base;
};
});
var lib_1 = lib.generateMulti;

var promiseContainer = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
function isPromise(obj) {
    return !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function';
}
exports.isPromise = isPromise;
let promise = commonjsGlobal.Promise;
function get() {
    return promise;
}
exports.get = get;
function set(lib) {
    if (typeof lib !== 'function') {
        throw new Error(`Provided Promise must be a function, got ${lib}`);
    }
    promise = lib;
}
exports.set = set;
});

unwrapExports(promiseContainer);
var promiseContainer_1 = promiseContainer.isPromise;
var promiseContainer_2 = promiseContainer.get;
var promiseContainer_3 = promiseContainer.set;

//Try catch is not supported in optimizing
//compiler, so it is isolated
var errorObj = {e: {}};
var tryCatchTarget;

function tryCatcher() {
  try {
    var target = tryCatchTarget;
    tryCatchTarget = null;
    return target.apply(this, arguments)
  } catch (e) {
    errorObj.e = e;
    return errorObj
  }
}
function tryCatch(fn) {
  tryCatchTarget = fn;
  return tryCatcher
}

var tryCatch_1 = tryCatch;
var errorObj_1 = errorObj;

var utils$1 = {
	tryCatch: tryCatch_1,
	errorObj: errorObj_1
};

var tryCatch$1 = utils$1.tryCatch;
var errorObj$1 = utils$1.errorObj;

function throwLater (e) {
  setTimeout(function () {
    throw e
  }, 0);
}

function asCallback (promise, nodeback, options) {
  if (typeof nodeback === 'function') {
    promise.then(function (val) {
      var ret;
      if (options !== undefined && Object(options).spread && Array.isArray(val)) {
        ret = tryCatch$1(nodeback).apply(undefined, [null].concat(val));
      } else {
        ret = val === undefined
          ? tryCatch$1(nodeback)(null)
          : tryCatch$1(nodeback)(null, val);
      }
      if (ret === errorObj$1) {
        throwLater(ret.e);
      }
    }, function (reason) {
      if (!reason) {
        var newReason = new Error(reason + '');
        newReason.cause = reason;
        reason = newReason;
      }
      var ret = tryCatch$1(nodeback)(reason);
      if (ret === errorObj$1) {
        throwLater(ret.e);
      }
    });
  }

  return promise
}

var standardAsCallback = asCallback;

/**
 * Command instance
 *
 * It's rare that you need to create a Command instance yourself.
 *
 * @constructor
 * @param {string} name - Command name
 * @param {string[]} [args=null] - An array of command arguments
 * @param {object} [options]
 * @param {string} [options.replyEncoding=null] - Set the encoding of the reply,
 * by default buffer will be returned.
 * @param {function} [callback=null] - The callback that handles the response.
 * If omit, the response will be handled via Promise.
 * @example
 * ```js
 * var infoCommand = new Command('info', null, function (err, result) {
 *   console.log('result', result);
 * });
 *
 * redis.sendCommand(infoCommand);
 *
 * // When no callback provided, Command instance will have a `promise` property,
 * // which will resolve/reject with the result of the command.
 * var getCommand = new Command('get', ['foo']);
 * getCommand.promise.then(function (result) {
 *   console.log('result', result);
 * });
 * ```
 *
 * @see {@link Redis#sendCommand} which can send a Command instance to Redis
 * @public
 */
function Command(name, args, options, callback) {
    if (typeof options === 'undefined') {
        options = {};
    }
    this.name = name;
    this.replyEncoding = options.replyEncoding;
    this.errorStack = options.errorStack;
    this.args = args ? lodash.flatten(args) : [];
    this.callback = callback;
    this.initPromise();
    var keyPrefix = options.keyPrefix;
    if (keyPrefix) {
        this._iterateKeys(function (key) {
            return keyPrefix + key;
        });
    }
}
Command.prototype.initPromise = function () {
    var _this = this;
    var Promise = promiseContainer.get();
    var promise = new Promise(function (resolve, reject) {
        if (!_this.transformed) {
            _this.transformed = true;
            var transformer = Command._transformer.argument[_this.name];
            if (transformer) {
                _this.args = transformer(_this.args);
            }
            _this.stringifyArguments();
        }
        _this.resolve = _this._convertValue(resolve);
        if (_this.errorStack) {
            _this.reject = function (err) {
                reject(utils.optimizeErrorStack(err, _this.errorStack, __dirname));
            };
        }
        else {
            _this.reject = reject;
        }
    });
    this.promise = standardAsCallback(promise, this.callback);
};
Command.prototype.getSlot = function () {
    if (typeof this._slot === 'undefined') {
        var key = this.getKeys()[0];
        if (key == null) {
            this.slot = null;
        }
        else {
            this.slot = lib(key);
        }
    }
    return this.slot;
};
Command.prototype.getKeys = function () {
    return this._iterateKeys();
};
/**
 * Iterate through the command arguments that are considered keys.
 *
 * @param {function} [transform] - The transformation that should be applied to
 * each key. The transformations will persist.
 * @return {string[]} The keys of the command.
 * @private
 */
Command.prototype._iterateKeys = function (transform) {
    if (typeof this._keys === 'undefined') {
        if (typeof transform !== 'function') {
            transform = function (key) {
                return key;
            };
        }
        this._keys = [];
        if (redisCommands.exists(this.name)) {
            var keyIndexes = redisCommands.getKeyIndexes(this.name, this.args);
            for (var i = 0; i < keyIndexes.length; i++) {
                var index = keyIndexes[i];
                this.args[index] = transform(this.args[index]);
                this._keys.push(this.args[index]);
            }
        }
    }
    return this._keys;
};
/**
 * Convert command to writable buffer or string
 *
 * @return {string|Buffer}
 * @see {@link Redis#sendCommand}
 * @public
 */
Command.prototype.toWritable = function () {
    var bufferMode = false;
    var i;
    for (i = 0; i < this.args.length; ++i) {
        if (this.args[i] instanceof Buffer) {
            bufferMode = true;
            break;
        }
    }
    var result, arg;
    var commandStr = '*' + (this.args.length + 1) + '\r\n$' + this.name.length + '\r\n' + this.name + '\r\n';
    if (bufferMode) {
        var resultBuffer = new flexbuffer.FlexBuffer(0);
        resultBuffer.write(commandStr);
        for (i = 0; i < this.args.length; ++i) {
            arg = this.args[i];
            if (arg instanceof Buffer) {
                if (arg.length === 0) {
                    resultBuffer.write('$0\r\n\r\n');
                }
                else {
                    resultBuffer.write('$' + arg.length + '\r\n');
                    resultBuffer.write(arg);
                    resultBuffer.write('\r\n');
                }
            }
            else {
                resultBuffer.write('$' + Buffer.byteLength(arg) + '\r\n' + arg + '\r\n');
            }
        }
        result = resultBuffer.getBuffer();
    }
    else {
        result = commandStr;
        for (i = 0; i < this.args.length; ++i) {
            result += '$' + Buffer.byteLength(this.args[i]) + '\r\n' + this.args[i] + '\r\n';
        }
    }
    return result;
};
Command.prototype.stringifyArguments = function () {
    for (var i = 0; i < this.args.length; ++i) {
        if (!(this.args[i] instanceof Buffer) && typeof this.args[i] !== 'string') {
            this.args[i] = utils.toArg(this.args[i]);
        }
    }
};
/**
 * Convert the value from buffer to the target encoding.
 *
 * @param {function} resolve - The resolve function of the Promise
 * @return {function} A funtion to transform and resolve a value
 * @private
 */
Command.prototype._convertValue = function (resolve) {
    var _this = this;
    return function (value) {
        try {
            resolve(_this.transformReply(value));
        }
        catch (err) {
            _this.reject(err);
        }
        return _this.promise;
    };
};
/**
 * Convert buffer/buffer[] to string/string[],
 * and apply reply transformer.
 *
 * @public
 */
Command.prototype.transformReply = function (result) {
    if (this.replyEncoding) {
        result = utils.convertBufferToString(result, this.replyEncoding);
    }
    var transformer = Command._transformer.reply[this.name];
    if (transformer) {
        result = transformer(result);
    }
    return result;
};
Command.FLAGS = {
    // Commands that can be processed when client is in the subscriber mode
    VALID_IN_SUBSCRIBER_MODE: ['subscribe', 'psubscribe', 'unsubscribe', 'punsubscribe', 'ping', 'quit'],
    // Commands that are valid in monitor mode
    VALID_IN_MONITOR_MODE: ['monitor', 'auth'],
    // Commands that will turn current connection into subscriber mode
    ENTER_SUBSCRIBER_MODE: ['subscribe', 'psubscribe'],
    // Commands that may make current connection quit subscriber mode
    EXIT_SUBSCRIBER_MODE: ['unsubscribe', 'punsubscribe'],
    // Commands that will make client disconnect from server TODO shutdown?
    WILL_DISCONNECT: ['quit']
};
var flagMap = Object.keys(Command.FLAGS).reduce(function (map, flagName) {
    map[flagName] = {};
    Command.FLAGS[flagName].forEach(function (commandName) {
        map[flagName][commandName] = true;
    });
    return map;
}, {});
/**
 * Check whether the command has the flag
 *
 * @param {string} flagName
 * @param {string} commandName
 * @return {boolean}
 */
Command.checkFlag = function (flagName, commandName) {
    return !!flagMap[flagName][commandName];
};
Command._transformer = {
    argument: {},
    reply: {}
};
Command.setArgumentTransformer = function (name, func) {
    Command._transformer.argument[name] = func;
};
Command.setReplyTransformer = function (name, func) {
    Command._transformer.reply[name] = func;
};
var msetArgumentTransformer = function (args) {
    if (args.length === 1) {
        if (typeof Map !== 'undefined' && args[0] instanceof Map) {
            return utils.convertMapToArray(args[0]);
        }
        if (typeof args[0] === 'object' && args[0] !== null) {
            return utils.convertObjectToArray(args[0]);
        }
    }
    return args;
};
Command.setArgumentTransformer('mset', msetArgumentTransformer);
Command.setArgumentTransformer('msetnx', msetArgumentTransformer);
Command.setArgumentTransformer('hmset', function (args) {
    if (args.length === 2) {
        if (typeof Map !== 'undefined' && args[1] instanceof Map) {
            return [args[0]].concat(utils.convertMapToArray(args[1]));
        }
        if (typeof args[1] === 'object' && args[1] !== null) {
            return [args[0]].concat(utils.convertObjectToArray(args[1]));
        }
    }
    return args;
});
Command.setReplyTransformer('hgetall', function (result) {
    if (Array.isArray(result)) {
        var obj = {};
        for (var i = 0; i < result.length; i += 2) {
            obj[result[i]] = result[i + 1];
        }
        return obj;
    }
    return result;
});
var command$1 = Command;

function Script(lua, numberOfKeys, keyPrefix) {
    this.lua = lua;
    this.sha = crypto.createHash('sha1').update(this.lua).digest('hex');
    this.numberOfKeys = typeof numberOfKeys === 'number' ? numberOfKeys : null;
    this.keyPrefix = keyPrefix ? keyPrefix : '';
}
Script.prototype.execute = function (container, args, options, callback) {
    if (typeof this.numberOfKeys === 'number') {
        args.unshift(this.numberOfKeys);
    }
    if (this.keyPrefix) {
        options.keyPrefix = this.keyPrefix;
    }
    var evalsha = new command$1('evalsha', [this.sha].concat(args), options);
    evalsha.isCustomCommand = true;
    var result = container.sendCommand(evalsha);
    if (promiseContainer.isPromise(result)) {
        var _this = this;
        return standardAsCallback(result.catch(function (err) {
            if (err.toString().indexOf('NOSCRIPT') === -1) {
                throw err;
            }
            return container.sendCommand(new command$1('eval', [_this.lua].concat(args), options));
        }), callback);
    }
    // result is not a Promise--probably returned from a pipeline chain; however,
    // we still need the callback to fire when the script is evaluated
    standardAsCallback(evalsha.promise, callback);
    return result;
};
var script$1 = Script;

var DROP_BUFFER_SUPPORT_ERROR = '*Buffer methods are not available ' +
    'because "dropBufferSupport" option is enabled.' +
    'Refer to https://github.com/luin/ioredis/wiki/Improve-Performance for more details.';
/**
 * Commander
 *
 * This is the base class of Redis, Redis.Cluster and Pipeline
 *
 * @param {boolean} [options.showFriendlyErrorStack=false] - Whether to show a friendly error stack.
 * Will decrease the performance significantly.
 * @constructor
 */
function Commander() {
    this.options = lodash.defaults({}, this.options || {}, {
        showFriendlyErrorStack: false
    });
    this.scriptsSet = {};
}
var commands$3 = lodash.difference(redisCommands.list, ['monitor']);
commands$3.push('sentinel');
/**
 * Return supported builtin commands
 *
 * @return {string[]} command list
 * @public
 */
Commander.prototype.getBuiltinCommands = function () {
    return lodash.clone(commands$3);
};
/**
 * Create a builtin command
 *
 * @param {string} commandName - command name
 * @return {object} functions
 * @public
 */
Commander.prototype.createBuiltinCommand = function (commandName) {
    return {
        string: generateFunction(commandName, 'utf8'),
        buffer: generateFunction(commandName, null)
    };
};
lodash.forEach(commands$3, function (commandName) {
    Commander.prototype[commandName] = generateFunction(commandName, 'utf8');
    Commander.prototype[commandName + 'Buffer'] = generateFunction(commandName, null);
});
Commander.prototype.call = generateFunction('utf8');
Commander.prototype.callBuffer = generateFunction(null);
Commander.prototype.send_command = Commander.prototype.call;
/**
 * Define a custom command using lua script
 *
 * @param {string} name - the command name
 * @param {object} definition
 * @param {string} definition.lua - the lua code
 * @param {number} [definition.numberOfKeys=null] - the number of keys.
 * If omit, you have to pass the number of keys as the first argument every time you invoke the command
 */
Commander.prototype.defineCommand = function (name, definition) {
    var script = new script$1(definition.lua, definition.numberOfKeys, this.options.keyPrefix);
    this.scriptsSet[name] = script;
    this[name] = generateScriptingFunction(script, 'utf8');
    this[name + 'Buffer'] = generateScriptingFunction(script, null);
};
/**
 * Send a command
 *
 * @abstract
 * @public
 */
Commander.prototype.sendCommand = function () { };
function generateFunction(_commandName, _encoding) {
    if (typeof _encoding === 'undefined') {
        _encoding = _commandName;
        _commandName = null;
    }
    return function () {
        var firstArgIndex = 0;
        var commandName = _commandName;
        if (commandName === null) {
            commandName = arguments[0];
            firstArgIndex = 1;
        }
        var length = arguments.length;
        var lastArgIndex = length - 1;
        var callback = arguments[lastArgIndex];
        if (typeof callback !== 'function') {
            callback = undefined;
        }
        else {
            length = lastArgIndex;
        }
        var args = new Array(length - firstArgIndex);
        for (var i = firstArgIndex; i < length; ++i) {
            args[i - firstArgIndex] = arguments[i];
        }
        var options;
        if (this.options.dropBufferSupport) {
            if (!_encoding) {
                return standardAsCallback(promiseContainer.get().reject(new Error(DROP_BUFFER_SUPPORT_ERROR)), callback);
            }
            options = { replyEncoding: null };
        }
        else {
            options = { replyEncoding: _encoding };
        }
        if (this.options.showFriendlyErrorStack) {
            options.errorStack = new Error().stack;
        }
        if (this.options.keyPrefix) {
            options.keyPrefix = this.options.keyPrefix;
        }
        return this.sendCommand(new command$1(commandName, args, options, callback));
    };
}
function generateScriptingFunction(_script, _encoding) {
    return function () {
        var length = arguments.length;
        var lastArgIndex = length - 1;
        var callback = arguments[lastArgIndex];
        if (typeof callback !== 'function') {
            callback = undefined;
        }
        else {
            length = lastArgIndex;
        }
        var args = new Array(length);
        for (var i = 0; i < length; i++) {
            args[i] = arguments[i];
        }
        var options;
        if (this.options.dropBufferSupport) {
            if (!_encoding) {
                return standardAsCallback(promiseContainer.get().reject(new Error(DROP_BUFFER_SUPPORT_ERROR)), callback);
            }
            options = { replyEncoding: null };
        }
        else {
            options = { replyEncoding: _encoding };
        }
        if (this.options.showFriendlyErrorStack) {
            options.errorStack = new Error().stack;
        }
        return _script.execute(this, args, options, callback);
    };
}
var commander = Commander;

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug$1 = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms$$1 = curr - (prevTime || curr);
    self.diff = ms$$1;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});
var debug_1 = debug$1.coerce;
var debug_2 = debug$1.disable;
var debug_3 = debug$1.enable;
var debug_4 = debug$1.enabled;
var debug_5 = debug$1.humanize;
var debug_6 = debug$1.instances;
var debug_7 = debug$1.names;
var debug_8 = debug$1.skips;
var debug_9 = debug$1.formatters;

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$1;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var hasFlag = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream$$1) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream$$1 && !stream$$1.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream$$1) {
	const level = supportsColor(stream$$1);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug$1;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor = supportsColor_1;
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});

var MAX_ARGUMENT_LENGTH = 200;
/**
 * helper function that tried to get a string value for
 * arbitrary "debug" arg
 *
 * @param  {mixed} v
 * @return {String|undefined}
 */
function getStringValue(v) {
    if (v === null)
        return;
    switch (typeof v) {
        case 'boolean': return;
        case 'number': return;
        case 'object':
            if (Buffer.isBuffer(v)) {
                return v.toString('hex');
            }
            if (Array.isArray(v)) {
                return v.join(',');
            }
            try {
                return JSON.stringify(v);
            }
            catch (e) {
                return;
            }
        case 'string': return v;
    }
}
/**
 * helper function that redacts a string representation of a "debug" arg
 *
 * @param  {String} str
 * @param  {Number} max_len
 * @return {String}
 */
function genRedactedString(str, max_len) {
    var len = str.length;
    return len <= max_len ? str : str.slice(0, max_len) + ' ... <REDACTED full-length="' + len + '">';
}
/**
 * a wrapper for the `debug` module, used to generate
 * "debug functions" that trim the values in their output
 *
 * @param   {String}
 * @return  {Function}
 */
var debug_1$1 = function genDebugFunction(name) {
    var fn = src(name);
    function wrappedDebug() {
        if (!fn.enabled) {
            return; // no-op
        }
        var args = [].slice.call(arguments);
        var i = 1, l = args.length, str, len;
        // we skip the first arg because that is the message
        for (; i < l; i += 1) {
            str = getStringValue(args[i]);
            len = str && str.length || 0;
            if (len > MAX_ARGUMENT_LENGTH) {
                args[i] = genRedactedString(str, MAX_ARGUMENT_LENGTH);
            }
        }
        return fn.apply(null, args);
    }
    Object.defineProperties(wrappedDebug, {
        namespace: { get: function () {
                return fn.namespace;
            } },
        enabled: { get: function () {
                return fn.enabled;
            } },
        useColors: { get: function () {
                return fn.useColors;
            } },
        color: { get: function () {
                return fn.color;
            } },
        destroy: { get: function () {
                return fn.destroy;
            } },
        log: {
            get: function () {
                return fn.log;
            },
            set: function (l) {
                fn.log = l;
            }
        }
    });
    return wrappedDebug;
};
// expose private stuff for unit-testing
var MAX_ARGUMENT_LENGTH_1 = MAX_ARGUMENT_LENGTH;
var getStringValue_1 = getStringValue;
var genRedactedString_1 = genRedactedString;
debug_1$1.MAX_ARGUMENT_LENGTH = MAX_ARGUMENT_LENGTH_1;
debug_1$1.getStringValue = getStringValue_1;
debug_1$1.genRedactedString = genRedactedString_1;

// RedisError

function RedisError (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  Error.captureStackTrace(this, this.constructor);
}

util.inherits(RedisError, Error);

Object.defineProperty(RedisError.prototype, 'name', {
  value: 'RedisError',
  configurable: true,
  writable: true
});

// ParserError

function ParserError (message, buffer$$1, offset) {
  assert(buffer$$1);
  assert.strictEqual(typeof offset, 'number');

  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });

  const tmp = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  Error.captureStackTrace(this, this.constructor);
  Error.stackTraceLimit = tmp;
  this.offset = offset;
  this.buffer = buffer$$1;
}

util.inherits(ParserError, RedisError);

Object.defineProperty(ParserError.prototype, 'name', {
  value: 'ParserError',
  configurable: true,
  writable: true
});

// ReplyError

function ReplyError (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  const tmp = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  Error.captureStackTrace(this, this.constructor);
  Error.stackTraceLimit = tmp;
}

util.inherits(ReplyError, RedisError);

Object.defineProperty(ReplyError.prototype, 'name', {
  value: 'ReplyError',
  configurable: true,
  writable: true
});

// AbortError

function AbortError (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  Error.captureStackTrace(this, this.constructor);
}

util.inherits(AbortError, RedisError);

Object.defineProperty(AbortError.prototype, 'name', {
  value: 'AbortError',
  configurable: true,
  writable: true
});

// InterruptError

function InterruptError (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  Error.captureStackTrace(this, this.constructor);
}

util.inherits(InterruptError, AbortError);

Object.defineProperty(InterruptError.prototype, 'name', {
  value: 'InterruptError',
  configurable: true,
  writable: true
});

var old = {
  RedisError,
  ParserError,
  ReplyError,
  AbortError,
  InterruptError
};

class RedisError$1 extends Error {
  get name () {
    return this.constructor.name
  }
}

class ParserError$1 extends RedisError$1 {
  constructor (message, buffer$$1, offset) {
    assert(buffer$$1);
    assert.strictEqual(typeof offset, 'number');

    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    super(message);
    Error.stackTraceLimit = tmp;
    this.offset = offset;
    this.buffer = buffer$$1;
  }

  get name () {
    return this.constructor.name
  }
}

class ReplyError$1 extends RedisError$1 {
  constructor (message) {
    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    super(message);
    Error.stackTraceLimit = tmp;
  }
  get name () {
    return this.constructor.name
  }
}

class AbortError$1 extends RedisError$1 {
  get name () {
    return this.constructor.name
  }
}

class InterruptError$1 extends AbortError$1 {
  get name () {
    return this.constructor.name
  }
}

var modern = {
  RedisError: RedisError$1,
  ParserError: ParserError$1,
  ReplyError: ReplyError$1,
  AbortError: AbortError$1,
  InterruptError: InterruptError$1
};

const Errors = process.version.charCodeAt(1) < 55 && process.version.charCodeAt(2) === 46
  ? old // Node.js < 7
  : modern;

var redisErrors = Errors;

const { AbortError: AbortError$2 } = redisErrors;
var MaxRetriesPerRequestError_1 = class MaxRetriesPerRequestError extends AbortError$2 {
    constructor(maxRetriesPerRequest) {
        var message = `Reached the max retries per request limit (which is ${maxRetriesPerRequest}). Refer to "maxRetriesPerRequest" option for details.`;
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
    get name() {
        return this.constructor.name;
    }
};

var MaxRetriesPerRequestError = MaxRetriesPerRequestError_1;

var errors = {
	MaxRetriesPerRequestError: MaxRetriesPerRequestError
};

var event_handler = createCommonjsModule(function (module, exports) {
var debug = debug_1$1('ioredis:connection');



var { MaxRetriesPerRequestError } = errors;
exports.connectHandler = function (self) {
    return function () {
        self.setStatus('connect');
        self.resetCommandQueue();
        // AUTH command should be processed before any other commands
        var flushed = false;
        if (self.condition.auth) {
            self.auth(self.condition.auth, function (err) {
                if (err) {
                    if (err.message.indexOf('no password is set') === -1) {
                        flushed = true;
                        self.flushQueue(err);
                        self.silentEmit('error', err);
                        self.disconnect(true);
                    }
                    else {
                        console.warn('[WARN] Redis server does not require a password, but a password was supplied.');
                    }
                }
            });
        }
        if (self.condition.select) {
            self.select(self.condition.select);
        }
        if (!self.options.enableReadyCheck) {
            exports.readyHandler(self)();
        }
        self.initParser();
        if (self.options.enableReadyCheck) {
            self._readyCheck(function (err, info) {
                if (err) {
                    if (!flushed) {
                        self.flushQueue(new Error('Ready check failed: ' + err.message));
                        self.silentEmit('error', err);
                        self.disconnect(true);
                    }
                }
                else {
                    self.serverInfo = info;
                    if (self.connector.check(info)) {
                        exports.readyHandler(self)();
                    }
                    else {
                        self.disconnect(true);
                    }
                }
            });
        }
    };
};
exports.closeHandler = function (self) {
    return function () {
        self.setStatus('close');
        if (!self.prevCondition) {
            self.prevCondition = self.condition;
        }
        if (self.commandQueue.length) {
            self.prevCommandQueue = self.commandQueue;
        }
        if (self.manuallyClosing) {
            self.manuallyClosing = false;
            debug('skip reconnecting since the connection is manually closed.');
            return close();
        }
        if (typeof self.options.retryStrategy !== 'function') {
            debug('skip reconnecting because `retryStrategy` is not a function');
            return close();
        }
        var retryDelay = self.options.retryStrategy(++self.retryAttempts);
        if (typeof retryDelay !== 'number') {
            debug('skip reconnecting because `retryStrategy` doesn\'t return a number');
            return close();
        }
        debug('reconnect in %sms', retryDelay);
        self.setStatus('reconnecting', retryDelay);
        self.reconnectTimeout = setTimeout(function () {
            self.reconnectTimeout = null;
            self.connect().catch(lodash.noop);
        }, retryDelay);
        var { maxRetriesPerRequest } = self.options;
        if (typeof maxRetriesPerRequest === 'number') {
            if (maxRetriesPerRequest < 0) {
                debug('maxRetriesPerRequest is negative, ignoring...');
            }
            else {
                var remainder = self.retryAttempts % (maxRetriesPerRequest + 1);
                if (remainder === 0) {
                    debug('reach maxRetriesPerRequest limitation, flushing command queue...');
                    self.flushQueue(new MaxRetriesPerRequestError(maxRetriesPerRequest));
                }
            }
        }
    };
    function close() {
        self.setStatus('end');
        self.flushQueue(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
    }
};
exports.dataHandler = function (self) {
    return function (data) {
        self.replyParser.execute(data);
    };
};
exports.errorHandler = function (self) {
    return function (error) {
        debug('error: %s', error);
        self.silentEmit('error', error);
    };
};
exports.readyHandler = function (self) {
    return function () {
        self.setStatus('ready');
        self.retryAttempts = 0;
        if (self.options.monitor) {
            self.call('monitor');
            var sendCommand = self.sendCommand;
            self.sendCommand = function (command) {
                if (command$1.checkFlag('VALID_IN_MONITOR_MODE', command.name)) {
                    return sendCommand.call(self, command);
                }
                command.reject(new Error('Connection is in monitoring mode, can\'t process commands.'));
                return command.promise;
            };
            self.once('close', function () {
                delete self.sendCommand;
            });
            self.setStatus('monitoring');
            return;
        }
        var item;
        var finalSelect = self.prevCondition ? self.prevCondition.select : self.condition.select;
        if (self.options.connectionName) {
            debug('set the connection name [%s]', self.options.connectionName);
            self.client('setname', self.options.connectionName);
        }
        if (self.options.readOnly) {
            debug('set the connection to readonly mode');
            self.readonly().catch(lodash.noop);
        }
        if (self.prevCondition) {
            var condition = self.prevCondition;
            self.prevCondition = null;
            if (condition.subscriber && self.options.autoResubscribe) {
                // We re-select the previous db first since
                // `SELECT` command is not valid in sub mode.
                if (self.condition.select !== finalSelect) {
                    debug('connect to db [%d]', finalSelect);
                    self.select(finalSelect);
                }
                var subscribeChannels = condition.subscriber.channels('subscribe');
                if (subscribeChannels.length) {
                    debug('subscribe %d channels', subscribeChannels.length);
                    self.subscribe(subscribeChannels);
                }
                var psubscribeChannels = condition.subscriber.channels('psubscribe');
                if (psubscribeChannels.length) {
                    debug('psubscribe %d channels', psubscribeChannels.length);
                    self.psubscribe(psubscribeChannels);
                }
            }
        }
        if (self.prevCommandQueue) {
            if (self.options.autoResendUnfulfilledCommands) {
                debug('resend %d unfulfilled commands', self.prevCommandQueue.length);
                while (self.prevCommandQueue.length > 0) {
                    item = self.prevCommandQueue.shift();
                    if (item.select !== self.condition.select && item.command.name !== 'select') {
                        self.select(item.select);
                    }
                    self.sendCommand(item.command, item.stream);
                }
            }
            else {
                self.prevCommandQueue = null;
            }
        }
        if (self.offlineQueue.length) {
            debug('send %d commands in offline queue', self.offlineQueue.length);
            var offlineQueue = self.offlineQueue;
            self.resetOfflineQueue();
            while (offlineQueue.length > 0) {
                item = offlineQueue.shift();
                if (item.select !== self.condition.select && item.command.name !== 'select') {
                    self.select(item.select);
                }
                self.sendCommand(item.command, item.stream);
            }
        }
        if (self.condition.select !== finalSelect) {
            debug('connect to db [%d]', finalSelect);
            self.select(finalSelect);
        }
    };
};
});
var event_handler_1 = event_handler.connectHandler;
var event_handler_2 = event_handler.closeHandler;
var event_handler_3 = event_handler.dataHandler;
var event_handler_4 = event_handler.errorHandler;
var event_handler_5 = event_handler.readyHandler;

var AbstractConnector_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractConnector {
    constructor() {
        this.connecting = false;
    }
    check(info) {
        return true;
    }
    disconnect() {
        this.connecting = false;
        if (this.stream) {
            this.stream.end();
        }
    }
}
exports.default = AbstractConnector;
});

unwrapExports(AbstractConnector_1);

var StandaloneConnector_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




function isIIpcConnectionOptions(value) {
    return value.path;
}
exports.isIIpcConnectionOptions = isIIpcConnectionOptions;
class StandaloneConnector extends AbstractConnector_1.default {
    constructor(options) {
        super();
        this.options = options;
    }
    connect(callback, _) {
        const { options } = this;
        this.connecting = true;
        let connectionOptions;
        if (isIIpcConnectionOptions(options)) {
            connectionOptions = {
                path: options.path
            };
        }
        else {
            connectionOptions = {};
            if (options.port != null) {
                connectionOptions.port = options.port;
            }
            if (options.host != null) {
                connectionOptions.host = options.host;
            }
            if (options.family != null) {
                connectionOptions.family = options.family;
            }
        }
        if (options.tls) {
            Object.assign(connectionOptions, options.tls);
        }
        process.nextTick(() => {
            if (!this.connecting) {
                callback(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
                return;
            }
            let stream$$1;
            try {
                if (options.tls) {
                    stream$$1 = tls.connect(connectionOptions);
                }
                else {
                    stream$$1 = net.createConnection(connectionOptions);
                }
            }
            catch (err) {
                callback(err);
                return;
            }
            this.stream = stream$$1;
            callback(null, stream$$1);
        });
    }
}
exports.default = StandaloneConnector;
});

unwrapExports(StandaloneConnector_1);
var StandaloneConnector_2 = StandaloneConnector_1.isIIpcConnectionOptions;

var SentinelIterator_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
function isSentinelEql(a, b) {
    return ((a.host || '127.0.0.1') === (b.host || '127.0.0.1')) &&
        ((a.port || 26379) === (b.port || 26379));
}
class SentinelIterator {
    constructor(sentinels) {
        this.sentinels = sentinels;
        this.cursor = 0;
    }
    hasNext() {
        return this.cursor < this.sentinels.length;
    }
    next() {
        return this.hasNext() ? this.sentinels[this.cursor++] : null;
    }
    reset(moveCurrentEndpointToFirst) {
        if (moveCurrentEndpointToFirst && this.sentinels.length > 1 && this.cursor !== 1) {
            const remains = this.sentinels.slice(this.cursor - 1);
            this.sentinels = remains.concat(this.sentinels.slice(0, this.cursor - 1));
        }
        this.cursor = 0;
    }
    add(sentinel) {
        for (let i = 0; i < this.sentinels.length; i++) {
            if (isSentinelEql(sentinel, this.sentinels[i])) {
                return false;
            }
        }
        this.sentinels.push(sentinel);
        return true;
    }
    toString() {
        return `${JSON.stringify(this.sentinels)} @${this.cursor}`;
    }
}
exports.default = SentinelIterator;
});

unwrapExports(SentinelIterator_1);

var SentinelConnector_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });






const debug = debug_1$1('ioredis:SentinelConnector');
let Redis;
class SentinelConnector extends AbstractConnector_1.default {
    constructor(options) {
        super();
        this.options = options;
        if (this.options.sentinels.length === 0) {
            throw new Error('Requires at least one sentinel to connect to.');
        }
        if (!this.options.name) {
            throw new Error('Requires the name of master.');
        }
        this.sentinelIterator = new SentinelIterator_1.default(this.options.sentinels);
    }
    check(info) {
        const roleMatches = !info.role || this.options.role === info.role;
        if (!roleMatches) {
            debug('role invalid, expected %s, but got %s', this.options.role, info.role);
            // Start from the next item.
            // Note that `reset` will move the cursor to the previous element,
            // so we advance two steps here.
            this.sentinelIterator.next();
            this.sentinelIterator.next();
            this.sentinelIterator.reset(true);
        }
        return roleMatches;
    }
    connect(callback, eventEmitter) {
        this.connecting = true;
        this.retryAttempts = 0;
        let lastError;
        const _this = this;
        connectToNext();
        function connectToNext() {
            if (!_this.sentinelIterator.hasNext()) {
                _this.sentinelIterator.reset(false);
                const retryDelay = typeof _this.options.sentinelRetryStrategy === 'function'
                    ? _this.options.sentinelRetryStrategy(++_this.retryAttempts)
                    : null;
                let errorMsg = typeof retryDelay !== 'number'
                    ? 'All sentinels are unreachable and retry is disabled.'
                    : `All sentinels are unreachable. Retrying from scratch after ${retryDelay}ms.`;
                if (lastError) {
                    errorMsg += ` Last error: ${lastError.message}`;
                }
                debug(errorMsg);
                const error = new Error(errorMsg);
                if (typeof retryDelay === 'number') {
                    setTimeout(connectToNext, retryDelay);
                    eventEmitter('error', error);
                }
                else {
                    callback(error);
                }
                return;
            }
            const endpoint = _this.sentinelIterator.next();
            _this.resolve(endpoint, function (err, resolved) {
                if (!_this.connecting) {
                    callback(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
                    return;
                }
                if (resolved) {
                    debug('resolved: %s:%s', resolved.host, resolved.port);
                    _this.stream = net.createConnection(resolved);
                    _this.sentinelIterator.reset(true);
                    callback(null, _this.stream);
                }
                else {
                    const endpointAddress = endpoint.host + ':' + endpoint.port;
                    const errorMsg = err
                        ? 'failed to connect to sentinel ' + endpointAddress + ' because ' + err.message
                        : 'connected to sentinel ' + endpointAddress + ' successfully, but got an invalid reply: ' + resolved;
                    debug(errorMsg);
                    eventEmitter('sentinelError', new Error(errorMsg));
                    if (err) {
                        lastError = err;
                    }
                    connectToNext();
                }
            });
        }
    }
    updateSentinels(client, callback) {
        client.sentinel('sentinels', this.options.name, (err, result) => {
            if (err) {
                client.disconnect();
                return callback(err);
            }
            if (!Array.isArray(result)) {
                return callback(null);
            }
            result.map(utils.packObject).forEach(sentinel => {
                const flags = sentinel.flags ? sentinel.flags.split(',') : [];
                if (flags.indexOf('disconnected') === -1 && sentinel.ip && sentinel.port) {
                    const endpoint = addressResponseToAddress(sentinel);
                    if (this.sentinelIterator.add(endpoint)) {
                        debug('adding sentinel %s:%s', endpoint.host, endpoint.port);
                    }
                }
            });
            debug('Updated internal sentinels: %s', this.sentinelIterator);
            callback(null);
        });
    }
    resolveMaster(client, callback) {
        client.sentinel('get-master-addr-by-name', this.options.name, (err, result) => {
            if (err) {
                client.disconnect();
                return callback(err);
            }
            this.updateSentinels(client, (err) => {
                client.disconnect();
                if (err) {
                    return callback(err);
                }
                callback(null, Array.isArray(result) ? { host: result[0], port: Number(result[1]) } : null);
            });
        });
    }
    resolveSlave(client, callback) {
        client.sentinel('slaves', this.options.name, (err, result) => {
            client.disconnect();
            if (err) {
                return callback(err);
            }
            if (!Array.isArray(result)) {
                return callback(null, null);
            }
            const availableSlaves = result.map(utils.packObject).filter(slave => (slave.flags && !slave.flags.match(/(disconnected|s_down|o_down)/)));
            callback(null, selectPreferredSentinel(availableSlaves, this.options.preferredSlaves));
        });
    }
    resolve(endpoint, callback) {
        if (typeof Redis === 'undefined') {
            Redis = redis;
        }
        var client = new Redis({
            port: endpoint.port || 26379,
            host: endpoint.host,
            family: endpoint.family || (StandaloneConnector_1.isIIpcConnectionOptions(this.options) ? undefined : this.options.family),
            retryStrategy: null,
            enableReadyCheck: false,
            connectTimeout: this.options.connectTimeout,
            dropBufferSupport: true
        });
        // ignore the errors since resolve* methods will handle them
        client.on('error', noop);
        if (this.options.role === 'slave') {
            this.resolveSlave(client, callback);
        }
        else {
            this.resolveMaster(client, callback);
        }
    }
}
exports.default = SentinelConnector;
function selectPreferredSentinel(availableSlaves, preferredSlaves) {
    if (availableSlaves.length === 0) {
        return null;
    }
    let selectedSlave;
    if (typeof preferredSlaves === 'function') {
        selectedSlave = preferredSlaves(availableSlaves);
    }
    else if (preferredSlaves !== null && typeof preferredSlaves === 'object') {
        const preferredSlavesArray = Array.isArray(preferredSlaves)
            ? preferredSlaves
            : [preferredSlaves];
        // sort by priority
        preferredSlavesArray.sort((a, b) => {
            // default the priority to 1
            if (!a.prio) {
                a.prio = 1;
            }
            if (!b.prio) {
                b.prio = 1;
            }
            // lowest priority first
            if (a.prio < b.prio) {
                return -1;
            }
            if (a.prio > b.prio) {
                return 1;
            }
            return 0;
        });
        // loop over preferred slaves and return the first match
        for (let p = 0; p < preferredSlavesArray.length; p++) {
            for (let a = 0; a < availableSlaves.length; a++) {
                const slave = availableSlaves[a];
                if (slave.ip === preferredSlavesArray[p].ip) {
                    if (slave.port === preferredSlavesArray[p].port) {
                        selectedSlave = slave;
                        break;
                    }
                }
            }
            if (selectedSlave) {
                break;
            }
        }
    }
    // if none of the preferred slaves are available, a random available slave is returned
    if (!selectedSlave) {
        selectedSlave = lodash.sample(availableSlaves);
    }
    return addressResponseToAddress(selectedSlave);
}
function addressResponseToAddress(input) {
    return { host: input.ip, port: Number(input.port) };
}
function noop() { }
});

unwrapExports(SentinelConnector_1);

var connectors = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.StandaloneConnector = StandaloneConnector_1.default;

exports.SentinelConnector = SentinelConnector_1.default;
});

unwrapExports(connectors);
var connectors_1 = connectors.StandaloneConnector;
var connectors_2 = connectors.SentinelConnector;

var ScanStream_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Convenient class to convert the process of scaning keys to a readable stream.
 *
 * @export
 * @class ScanStream
 * @extends {Readable}
 */
class ScanStream extends stream.Readable {
    constructor(opt) {
        super(opt);
        this.opt = opt;
        this._redisCursor = '0';
        this._redisDrained = false;
    }
    _read() {
        if (this._redisDrained) {
            this.push(null);
            return;
        }
        const args = [this._redisCursor];
        if (this.opt.key) {
            args.unshift(this.opt.key);
        }
        if (this.opt.match) {
            args.push('MATCH', this.opt.match);
        }
        if (this.opt.count) {
            args.push('COUNT', String(this.opt.count));
        }
        this.opt.redis[this.opt.command](args, (err, res) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            this._redisCursor = (res[0] instanceof Buffer) ? res[0].toString() : res[0];
            if (this._redisCursor === '0') {
                this._redisDrained = true;
            }
            this.push(res[1]);
        });
    }
    close() {
        this._redisDrained = true;
    }
}
exports.default = ScanStream;
});

unwrapExports(ScanStream_1);

function Pipeline(redis) {
    commander.call(this);
    this.redis = redis;
    this.isCluster = this.redis.constructor.name === 'Cluster';
    this.options = redis.options;
    this._queue = [];
    this._result = [];
    this._transactions = 0;
    this._shaToScript = {};
    var _this = this;
    Object.keys(redis.scriptsSet).forEach(function (name) {
        var script = redis.scriptsSet[name];
        _this._shaToScript[script.sha] = script;
        _this[name] = redis[name];
        _this[name + 'Buffer'] = redis[name + 'Buffer'];
    });
    var Promise = promiseContainer.get();
    this.promise = new Promise(function (resolve, reject) {
        _this.resolve = resolve;
        _this.reject = reject;
    });
    Object.defineProperty(this, 'length', {
        get: function () {
            return _this._queue.length;
        }
    });
}
Object.assign(Pipeline.prototype, commander.prototype);
Pipeline.prototype.fillResult = function (value, position) {
    var i;
    if (this._queue[position].name === 'exec' && Array.isArray(value[1])) {
        var execLength = value[1].length;
        for (i = 0; i < execLength; i++) {
            if (value[1][i] instanceof Error) {
                continue;
            }
            var cmd = this._queue[position - (execLength - i)];
            try {
                value[1][i] = cmd.transformReply(value[1][i]);
            }
            catch (err) {
                value[1][i] = err;
            }
        }
    }
    this._result[position] = value;
    if (--this.replyPending) {
        return;
    }
    if (this.isCluster) {
        var retriable = true;
        var commonError;
        var inTransaction;
        for (i = 0; i < this._result.length; ++i) {
            var error = this._result[i][0];
            var command = this._queue[i];
            if (command.name === 'multi') {
                inTransaction = true;
            }
            else if (command.name === 'exec') {
                inTransaction = false;
            }
            if (error) {
                if (command.name === 'exec' && error.message === 'EXECABORT Transaction discarded because of previous errors.') {
                    continue;
                }
                if (!commonError) {
                    commonError = {
                        name: error.name,
                        message: error.message
                    };
                }
                else if (commonError.name !== error.name || commonError.message !== error.message) {
                    retriable = false;
                    break;
                }
            }
            else if (!inTransaction) {
                var isReadOnly = redisCommands.exists(command.name) && redisCommands.hasFlag(command.name, 'readonly');
                if (!isReadOnly) {
                    retriable = false;
                    break;
                }
            }
        }
        if (commonError && retriable) {
            var _this = this;
            var errv = commonError.message.split(' ');
            var queue = this._queue;
            inTransaction = false;
            this._queue = [];
            for (i = 0; i < queue.length; ++i) {
                if (errv[0] === 'ASK' && !inTransaction &&
                    queue[i].name !== 'asking' &&
                    (!queue[i - 1] || queue[i - 1].name !== 'asking')) {
                    var asking = new command$1('asking');
                    asking.ignore = true;
                    this.sendCommand(asking);
                }
                queue[i].initPromise();
                this.sendCommand(queue[i]);
                if (queue[i].name === 'multi') {
                    inTransaction = true;
                }
                else if (queue[i].name === 'exec') {
                    inTransaction = false;
                }
            }
            var matched = true;
            if (typeof this.leftRedirections === 'undefined') {
                this.leftRedirections = {};
            }
            var exec = function () {
                _this.exec();
            };
            this.redis.handleError(commonError, this.leftRedirections, {
                moved: function (slot, key) {
                    _this.preferKey = key;
                    _this.redis.slots[errv[1]] = [key];
                    _this.redis.refreshSlotsCache();
                    _this.exec();
                },
                ask: function (slot, key) {
                    _this.preferKey = key;
                    _this.exec();
                },
                tryagain: exec,
                clusterDown: exec,
                connectionClosed: exec,
                maxRedirections: function () {
                    matched = false;
                },
                defaults: function () {
                    matched = false;
                }
            });
            if (matched) {
                return;
            }
        }
    }
    var ignoredCount = 0;
    for (i = 0; i < this._queue.length - ignoredCount; ++i) {
        if (this._queue[i + ignoredCount].ignore) {
            ignoredCount += 1;
        }
        this._result[i] = this._result[i + ignoredCount];
    }
    this.resolve(this._result.slice(0, this._result.length - ignoredCount));
};
Pipeline.prototype.sendCommand = function (command) {
    var position = this._queue.length;
    var _this = this;
    command.promise.then(function (result) {
        _this.fillResult([null, result], position);
    }).catch(function (error) {
        _this.fillResult([error], position);
    });
    this._queue.push(command);
    return this;
};
Pipeline.prototype.addBatch = function (commands) {
    var command, commandName, args;
    for (var i = 0; i < commands.length; ++i) {
        command = commands[i];
        commandName = command[0];
        args = command.slice(1);
        this[commandName].apply(this, args);
    }
    return this;
};
var multi$1 = Pipeline.prototype.multi;
Pipeline.prototype.multi = function () {
    this._transactions += 1;
    return multi$1.apply(this, arguments);
};
var execBuffer = Pipeline.prototype.execBuffer;
var exec$1 = Pipeline.prototype.exec;
Pipeline.prototype.execBuffer = util.deprecate(function () {
    if (this._transactions > 0) {
        this._transactions -= 1;
    }
    return execBuffer.apply(this, arguments);
}, 'Pipeline#execBuffer: Use Pipeline#exec instead');
Pipeline.prototype.exec = function (callback) {
    if (this._transactions > 0) {
        this._transactions -= 1;
        return (this.options.dropBufferSupport ? exec$1 : execBuffer).apply(this, arguments);
    }
    if (!this.nodeifiedPromise) {
        this.nodeifiedPromise = true;
        standardAsCallback(this.promise, callback);
    }
    if (lodash.isEmpty(this._queue)) {
        this.resolve([]);
    }
    var pipelineSlot, i;
    if (this.isCluster) {
        // List of the first key for each command
        var sampleKeys = [];
        for (i = 0; i < this._queue.length; i++) {
            var keys = this._queue[i].getKeys();
            if (keys.length) {
                sampleKeys.push(keys[0]);
            }
        }
        if (sampleKeys.length) {
            pipelineSlot = lib.generateMulti(sampleKeys);
            if (pipelineSlot < 0) {
                this.reject(new Error('All keys in the pipeline should belong to the same slot'));
                return this.promise;
            }
        }
        else {
            // Send the pipeline to a random node
            pipelineSlot = Math.random() * 16384 | 0;
        }
    }
    // Check whether scripts exists
    var scripts = [];
    for (i = 0; i < this._queue.length; ++i) {
        var item = this._queue[i];
        if (this.isCluster && item.isCustomCommand) {
            this.reject(new Error('Sending custom commands in pipeline is not supported in Cluster mode.'));
            return this.promise;
        }
        if (item.name !== 'evalsha') {
            continue;
        }
        var script = this._shaToScript[item.args[0]];
        if (!script) {
            continue;
        }
        scripts.push(script);
    }
    var _this = this;
    if (!scripts.length) {
        return execPipeline();
    }
    return this.redis.script('exists', scripts.map(function (item) {
        return item.sha;
    })).then(function (results) {
        var pending = [];
        for (var i = 0; i < results.length; ++i) {
            if (!results[i]) {
                pending.push(scripts[i]);
            }
        }
        var Promise = promiseContainer.get();
        return Promise.all(pending.map(function (script) {
            return _this.redis.script('load', script.lua);
        }));
    }).then(execPipeline);
    function execPipeline() {
        var data = '';
        var writePending = _this.replyPending = _this._queue.length;
        var node;
        if (_this.isCluster) {
            node = { slot: pipelineSlot, redis: _this.redis.connectionPool.nodes.all[_this.preferKey] };
        }
        var bufferMode = false;
        var stream$$1 = {
            write: function (writable) {
                if (writable instanceof Buffer) {
                    bufferMode = true;
                }
                if (bufferMode) {
                    if (typeof data === 'string') {
                        var flexBuffer = new flexbuffer.FlexBuffer(0);
                        flexBuffer.write(data);
                        data = flexBuffer;
                    }
                    data.write(writable);
                }
                else {
                    data += writable;
                }
                if (!--writePending) {
                    if (bufferMode) {
                        data = data.getBuffer();
                    }
                    if (_this.isCluster) {
                        node.redis.stream.write(data);
                    }
                    else {
                        _this.redis.stream.write(data);
                    }
                    // Reset writePending for resending
                    writePending = _this._queue.length;
                    data = '';
                    bufferMode = false;
                }
            }
        };
        for (var i = 0; i < _this._queue.length; ++i) {
            _this.redis.sendCommand(_this._queue[i], stream$$1, node);
        }
        return _this.promise;
    }
};
var pipeline = Pipeline;

var addTransactionSupport = function (redis) {
    redis.pipeline = function (commands) {
        var pipeline$$1 = new pipeline(this);
        if (Array.isArray(commands)) {
            pipeline$$1.addBatch(commands);
        }
        return pipeline$$1;
    };
    var multi = redis.multi;
    redis.multi = function (commands, options) {
        if (typeof options === 'undefined' && !Array.isArray(commands)) {
            options = commands;
            commands = null;
        }
        if (options && options.pipeline === false) {
            return multi.call(this);
        }
        var pipeline$$1 = new pipeline(this);
        pipeline$$1.multi();
        if (Array.isArray(commands)) {
            pipeline$$1.addBatch(commands);
        }
        var exec = pipeline$$1.exec;
        pipeline$$1.exec = function (callback) {
            if (this._transactions > 0) {
                exec.call(pipeline$$1);
            }
            var promise = exec.call(pipeline$$1);
            return standardAsCallback(promise.then(function (result) {
                var execResult = result[result.length - 1];
                if (execResult[0]) {
                    execResult[0].previousErrors = [];
                    for (var i = 0; i < result.length - 1; ++i) {
                        if (result[i][0]) {
                            execResult[0].previousErrors.push(result[i][0]);
                        }
                    }
                    throw execResult[0];
                }
                return utils.wrapMultiResult(execResult[1]);
            }), callback);
        };
        var execBuffer = pipeline$$1.execBuffer;
        pipeline$$1.execBuffer = function (callback) {
            if (this._transactions > 0) {
                execBuffer.call(pipeline$$1);
            }
            return pipeline$$1.exec(callback);
        };
        return pipeline$$1;
    };
    var exec = redis.exec;
    redis.exec = function (callback) {
        return standardAsCallback(exec.call(this).then(function (results) {
            if (Array.isArray(results)) {
                results = utils.wrapMultiResult(results);
            }
            return results;
        }), callback);
    };
};

var transaction = {
	addTransactionSupport: addTransactionSupport
};

var SubscriptionSet_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tiny class to simplify dealing with subscription set
 *
 * @export
 * @class SubscriptionSet
 */
class SubscriptionSet {
    constructor() {
        this.set = {
            subscribe: {},
            psubscribe: {}
        };
    }
    add(set, channel) {
        this.set[mapSet(set)][channel] = true;
    }
    del(set, channel) {
        delete this.set[mapSet(set)][channel];
    }
    channels(set) {
        return Object.keys(this.set[mapSet(set)]);
    }
    isEmpty() {
        return this.channels('subscribe').length === 0 &&
            this.channels('psubscribe').length === 0;
    }
}
exports.default = SubscriptionSet;
function mapSet(set) {
    if (set === 'unsubscribe') {
        return 'subscribe';
    }
    if (set === 'punsubscribe') {
        return 'psubscribe';
    }
    return set;
}
});

unwrapExports(SubscriptionSet_1);

const Buffer$1 = buffer.Buffer;
const StringDecoder = string_decoder.StringDecoder;
const decoder = new StringDecoder();

const ReplyError$2 = redisErrors.ReplyError;
const ParserError$2 = redisErrors.ParserError;
var bufferPool = Buffer$1.allocUnsafe(32 * 1024);
var bufferOffset = 0;
var interval = null;
var counter = 0;
var notDecreased = 0;

/**
 * Used for integer numbers only
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|number}
 */
function parseSimpleNumbers (parser) {
  const length = parser.buffer.length - 1;
  var offset = parser.offset;
  var number = 0;
  var sign = 1;

  if (parser.buffer[offset] === 45) {
    sign = -1;
    offset++;
  }

  while (offset < length) {
    const c1 = parser.buffer[offset++];
    if (c1 === 13) { // \r\n
      parser.offset = offset + 1;
      return sign * number
    }
    number = (number * 10) + (c1 - 48);
  }
}

/**
 * Used for integer numbers in case of the returnNumbers option
 *
 * Reading the string as parts of n SMI is more efficient than
 * using a string directly.
 *
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|string}
 */
function parseStringNumbers (parser) {
  const length = parser.buffer.length - 1;
  var offset = parser.offset;
  var number = 0;
  var res = '';

  if (parser.buffer[offset] === 45) {
    res += '-';
    offset++;
  }

  while (offset < length) {
    var c1 = parser.buffer[offset++];
    if (c1 === 13) { // \r\n
      parser.offset = offset + 1;
      if (number !== 0) {
        res += number;
      }
      return res
    } else if (number > 429496728) {
      res += (number * 10) + (c1 - 48);
      number = 0;
    } else if (c1 === 48 && number === 0) {
      res += 0;
    } else {
      number = (number * 10) + (c1 - 48);
    }
  }
}

/**
 * Parse a '+' redis simple string response but forward the offsets
 * onto convertBufferRange to generate a string.
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|string|Buffer}
 */
function parseSimpleString (parser) {
  const start = parser.offset;
  const buffer$$1 = parser.buffer;
  const length = buffer$$1.length - 1;
  var offset = start;

  while (offset < length) {
    if (buffer$$1[offset++] === 13) { // \r\n
      parser.offset = offset + 1;
      if (parser.optionReturnBuffers === true) {
        return parser.buffer.slice(start, offset - 1)
      }
      return parser.buffer.toString('utf8', start, offset - 1)
    }
  }
}

/**
 * Returns the read length
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|number}
 */
function parseLength (parser) {
  const length = parser.buffer.length - 1;
  var offset = parser.offset;
  var number = 0;

  while (offset < length) {
    const c1 = parser.buffer[offset++];
    if (c1 === 13) {
      parser.offset = offset + 1;
      return number
    }
    number = (number * 10) + (c1 - 48);
  }
}

/**
 * Parse a ':' redis integer response
 *
 * If stringNumbers is activated the parser always returns numbers as string
 * This is important for big numbers (number > Math.pow(2, 53)) as js numbers
 * are 64bit floating point numbers with reduced precision
 *
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|number|string}
 */
function parseInteger (parser) {
  if (parser.optionStringNumbers === true) {
    return parseStringNumbers(parser)
  }
  return parseSimpleNumbers(parser)
}

/**
 * Parse a '$' redis bulk string response
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|null|string}
 */
function parseBulkString (parser) {
  const length = parseLength(parser);
  if (length === undefined) {
    return
  }
  if (length < 0) {
    return null
  }
  const offset = parser.offset + length;
  if (offset + 2 > parser.buffer.length) {
    parser.bigStrSize = offset + 2;
    parser.totalChunkSize = parser.buffer.length;
    parser.bufferCache.push(parser.buffer);
    return
  }
  const start = parser.offset;
  parser.offset = offset + 2;
  if (parser.optionReturnBuffers === true) {
    return parser.buffer.slice(start, offset)
  }
  return parser.buffer.toString('utf8', start, offset)
}

/**
 * Parse a '-' redis error response
 * @param {JavascriptRedisParser} parser
 * @returns {ReplyError}
 */
function parseError (parser) {
  var string = parseSimpleString(parser);
  if (string !== undefined) {
    if (parser.optionReturnBuffers === true) {
      string = string.toString();
    }
    return new ReplyError$2(string)
  }
}

/**
 * Parsing error handler, resets parser buffer
 * @param {JavascriptRedisParser} parser
 * @param {number} type
 * @returns {undefined}
 */
function handleError (parser, type) {
  const err = new ParserError$2(
    'Protocol error, got ' + JSON.stringify(String.fromCharCode(type)) + ' as reply type byte',
    JSON.stringify(parser.buffer),
    parser.offset
  );
  parser.buffer = null;
  parser.returnFatalError(err);
}

/**
 * Parse a '*' redis array response
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|null|any[]}
 */
function parseArray (parser) {
  const length = parseLength(parser);
  if (length === undefined) {
    return
  }
  if (length < 0) {
    return null
  }
  const responses = new Array(length);
  return parseArrayElements(parser, responses, 0)
}

/**
 * Push a partly parsed array to the stack
 *
 * @param {JavascriptRedisParser} parser
 * @param {any[]} array
 * @param {number} pos
 * @returns {undefined}
 */
function pushArrayCache (parser, array, pos) {
  parser.arrayCache.push(array);
  parser.arrayPos.push(pos);
}

/**
 * Parse chunked redis array response
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|any[]}
 */
function parseArrayChunks (parser) {
  const tmp = parser.arrayCache.pop();
  var pos = parser.arrayPos.pop();
  if (parser.arrayCache.length) {
    const res = parseArrayChunks(parser);
    if (res === undefined) {
      pushArrayCache(parser, tmp, pos);
      return
    }
    tmp[pos++] = res;
  }
  return parseArrayElements(parser, tmp, pos)
}

/**
 * Parse redis array response elements
 * @param {JavascriptRedisParser} parser
 * @param {Array} responses
 * @param {number} i
 * @returns {undefined|null|any[]}
 */
function parseArrayElements (parser, responses, i) {
  const bufferLength = parser.buffer.length;
  while (i < responses.length) {
    const offset = parser.offset;
    if (parser.offset >= bufferLength) {
      pushArrayCache(parser, responses, i);
      return
    }
    const response = parseType(parser, parser.buffer[parser.offset++]);
    if (response === undefined) {
      if (!(parser.arrayCache.length || parser.bufferCache.length)) {
        parser.offset = offset;
      }
      pushArrayCache(parser, responses, i);
      return
    }
    responses[i] = response;
    i++;
  }

  return responses
}

/**
 * Called the appropriate parser for the specified type.
 *
 * 36: $
 * 43: +
 * 42: *
 * 58: :
 * 45: -
 *
 * @param {JavascriptRedisParser} parser
 * @param {number} type
 * @returns {*}
 */
function parseType (parser, type) {
  switch (type) {
    case 36:
      return parseBulkString(parser)
    case 43:
      return parseSimpleString(parser)
    case 42:
      return parseArray(parser)
    case 58:
      return parseInteger(parser)
    case 45:
      return parseError(parser)
    default:
      return handleError(parser, type)
  }
}

/**
 * Decrease the bufferPool size over time
 *
 * Balance between increasing and decreasing the bufferPool.
 * Decrease the bufferPool by 10% by removing the first 10% of the current pool.
 * @returns {undefined}
 */
function decreaseBufferPool () {
  if (bufferPool.length > 50 * 1024) {
    if (counter === 1 || notDecreased > counter * 2) {
      const minSliceLen = Math.floor(bufferPool.length / 10);
      const sliceLength = minSliceLen < bufferOffset
        ? bufferOffset
        : minSliceLen;
      bufferOffset = 0;
      bufferPool = bufferPool.slice(sliceLength, bufferPool.length);
    } else {
      notDecreased++;
      counter--;
    }
  } else {
    clearInterval(interval);
    counter = 0;
    notDecreased = 0;
    interval = null;
  }
}

/**
 * Check if the requested size fits in the current bufferPool.
 * If it does not, reset and increase the bufferPool accordingly.
 *
 * @param {number} length
 * @returns {undefined}
 */
function resizeBuffer (length) {
  if (bufferPool.length < length + bufferOffset) {
    const multiplier = length > 1024 * 1024 * 75 ? 2 : 3;
    if (bufferOffset > 1024 * 1024 * 111) {
      bufferOffset = 1024 * 1024 * 50;
    }
    bufferPool = Buffer$1.allocUnsafe(length * multiplier + bufferOffset);
    bufferOffset = 0;
    counter++;
    if (interval === null) {
      interval = setInterval(decreaseBufferPool, 50);
    }
  }
}

/**
 * Concat a bulk string containing multiple chunks
 *
 * Notes:
 * 1) The first chunk might contain the whole bulk string including the \r
 * 2) We are only safe to fully add up elements that are neither the first nor any of the last two elements
 *
 * @param {JavascriptRedisParser} parser
 * @returns {String}
 */
function concatBulkString (parser) {
  const list = parser.bufferCache;
  const oldOffset = parser.offset;
  var chunks = list.length;
  var offset = parser.bigStrSize - parser.totalChunkSize;
  parser.offset = offset;
  if (offset <= 2) {
    if (chunks === 2) {
      return list[0].toString('utf8', oldOffset, list[0].length + offset - 2)
    }
    chunks--;
    offset = list[list.length - 2].length + offset;
  }
  var res = decoder.write(list[0].slice(oldOffset));
  for (var i = 1; i < chunks - 1; i++) {
    res += decoder.write(list[i]);
  }
  res += decoder.end(list[i].slice(0, offset - 2));
  return res
}

/**
 * Concat the collected chunks from parser.bufferCache.
 *
 * Increases the bufferPool size beforehand if necessary.
 *
 * @param {JavascriptRedisParser} parser
 * @returns {Buffer}
 */
function concatBulkBuffer (parser) {
  const list = parser.bufferCache;
  const oldOffset = parser.offset;
  const length = parser.bigStrSize - oldOffset - 2;
  var chunks = list.length;
  var offset = parser.bigStrSize - parser.totalChunkSize;
  parser.offset = offset;
  if (offset <= 2) {
    if (chunks === 2) {
      return list[0].slice(oldOffset, list[0].length + offset - 2)
    }
    chunks--;
    offset = list[list.length - 2].length + offset;
  }
  resizeBuffer(length);
  const start = bufferOffset;
  list[0].copy(bufferPool, start, oldOffset, list[0].length);
  bufferOffset += list[0].length - oldOffset;
  for (var i = 1; i < chunks - 1; i++) {
    list[i].copy(bufferPool, bufferOffset);
    bufferOffset += list[i].length;
  }
  list[i].copy(bufferPool, bufferOffset, 0, offset - 2);
  bufferOffset += offset - 2;
  return bufferPool.slice(start, bufferOffset)
}

class JavascriptRedisParser {
  /**
   * Javascript Redis Parser constructor
   * @param {{returnError: Function, returnReply: Function, returnFatalError?: Function, returnBuffers: boolean, stringNumbers: boolean }} options
   * @constructor
   */
  constructor (options) {
    if (!options) {
      throw new TypeError('Options are mandatory.')
    }
    if (typeof options.returnError !== 'function' || typeof options.returnReply !== 'function') {
      throw new TypeError('The returnReply and returnError options have to be functions.')
    }
    this.setReturnBuffers(!!options.returnBuffers);
    this.setStringNumbers(!!options.stringNumbers);
    this.returnError = options.returnError;
    this.returnFatalError = options.returnFatalError || options.returnError;
    this.returnReply = options.returnReply;
    this.reset();
  }

  /**
   * Reset the parser values to the initial state
   *
   * @returns {undefined}
   */
  reset () {
    this.offset = 0;
    this.buffer = null;
    this.bigStrSize = 0;
    this.totalChunkSize = 0;
    this.bufferCache = [];
    this.arrayCache = [];
    this.arrayPos = [];
  }

  /**
   * Set the returnBuffers option
   *
   * @param {boolean} returnBuffers
   * @returns {undefined}
   */
  setReturnBuffers (returnBuffers) {
    if (typeof returnBuffers !== 'boolean') {
      throw new TypeError('The returnBuffers argument has to be a boolean')
    }
    this.optionReturnBuffers = returnBuffers;
  }

  /**
   * Set the stringNumbers option
   *
   * @param {boolean} stringNumbers
   * @returns {undefined}
   */
  setStringNumbers (stringNumbers) {
    if (typeof stringNumbers !== 'boolean') {
      throw new TypeError('The stringNumbers argument has to be a boolean')
    }
    this.optionStringNumbers = stringNumbers;
  }

  /**
   * Parse the redis buffer
   * @param {Buffer} buffer
   * @returns {undefined}
   */
  execute (buffer$$1) {
    if (this.buffer === null) {
      this.buffer = buffer$$1;
      this.offset = 0;
    } else if (this.bigStrSize === 0) {
      const oldLength = this.buffer.length;
      const remainingLength = oldLength - this.offset;
      const newBuffer = Buffer$1.allocUnsafe(remainingLength + buffer$$1.length);
      this.buffer.copy(newBuffer, 0, this.offset, oldLength);
      buffer$$1.copy(newBuffer, remainingLength, 0, buffer$$1.length);
      this.buffer = newBuffer;
      this.offset = 0;
      if (this.arrayCache.length) {
        const arr = parseArrayChunks(this);
        if (arr === undefined) {
          return
        }
        this.returnReply(arr);
      }
    } else if (this.totalChunkSize + buffer$$1.length >= this.bigStrSize) {
      this.bufferCache.push(buffer$$1);
      var tmp = this.optionReturnBuffers ? concatBulkBuffer(this) : concatBulkString(this);
      this.bigStrSize = 0;
      this.bufferCache = [];
      this.buffer = buffer$$1;
      if (this.arrayCache.length) {
        this.arrayCache[0][this.arrayPos[0]++] = tmp;
        tmp = parseArrayChunks(this);
        if (tmp === undefined) {
          return
        }
      }
      this.returnReply(tmp);
    } else {
      this.bufferCache.push(buffer$$1);
      this.totalChunkSize += buffer$$1.length;
      return
    }

    while (this.offset < this.buffer.length) {
      const offset = this.offset;
      const type = this.buffer[this.offset++];
      const response = parseType(this, type);
      if (response === undefined) {
        if (!(this.arrayCache.length || this.bufferCache.length)) {
          this.offset = offset;
        }
        return
      }

      if (type === 45) {
        this.returnError(response);
      } else {
        this.returnReply(response);
      }
    }

    this.buffer = null;
  }
}

var parser = JavascriptRedisParser;

var redisParser = parser;

var SubscriptionSet$1 = SubscriptionSet_1.default;
var debug$2 = debug_1$1('ioredis:reply');

/**
 * Init the parser
 *
 * @method _initParser
 * @memberOf Redis#
 * @private
 */
var initParser = function () {
    var _this = this;
    this.replyParser = new redisParser({
        stringNumbers: this.options.stringNumbers,
        returnBuffers: !this.options.dropBufferSupport,
        returnError: function (err) {
            _this.returnError(err);
        },
        returnReply: function (reply) {
            _this.returnReply(reply);
        },
        returnFatalError: function (err) {
            err.message += '. Please report this.';
            _this.flushQueue(err, { offlineQueue: false });
            _this.silentEmit('error', err);
            _this.disconnect(true);
        }
    });
};
var returnError = function (err) {
    var item = this.commandQueue.shift();
    err.command = {
        name: item.command.name,
        args: item.command.args
    };
    var needReconnect = false;
    if (this.options.reconnectOnError) {
        needReconnect = this.options.reconnectOnError(err);
    }
    switch (needReconnect) {
        case 1:
        case true:
            if (this.status !== 'reconnecting') {
                this.disconnect(true);
            }
            item.command.reject(err);
            break;
        case 2:
            if (this.status !== 'reconnecting') {
                this.disconnect(true);
            }
            if (this.condition.select !== item.select && item.command.name !== 'select') {
                this.select(item.select);
            }
            this.sendCommand(item.command);
            break;
        default:
            item.command.reject(err);
    }
};
var sharedBuffers = {};
lodash.forEach(['message', 'pmessage', 'subscribe', 'psubscribe', 'unsubscribe', 'punsubscribe'], function (str) {
    sharedBuffers[str] = Buffer.from(str);
});
var returnReply = function (reply) {
    if (this.status === 'monitoring') {
        // Valid commands in the monitoring mode are AUTH and MONITOR,
        // both of which always reply with 'OK'.
        var replyStr = reply.toString();
        // If not the reply to AUTH & MONITOR
        if (replyStr !== 'OK') {
            // Since commands sent in the monitoring mode will trigger an exception,
            // any replies we received in the monitoring mode should consider to be
            // realtime monitor data instead of result of commands.
            var len = replyStr.indexOf(' ');
            var timestamp = replyStr.slice(0, len);
            var argindex = replyStr.indexOf('"');
            var args = replyStr.slice(argindex + 1, -1).split('" "').map(function (elem) {
                return elem.replace(/\\"/g, '"');
            });
            var dbAndSource = replyStr.slice(len + 2, argindex - 2).split(' ');
            this.emit('monitor', timestamp, args, dbAndSource[1], dbAndSource[0]);
            return;
        }
    }
    var item, channel, count;
    if (this.condition.subscriber) {
        var replyType = Array.isArray(reply) ? reply[0].toString() : null;
        debug$2('receive reply "%s" in subscriber mode', replyType);
        switch (replyType) {
            case 'message':
                if (this.listeners('message').length > 0) {
                    this.emit('message', reply[1].toString(), reply[2].toString());
                }
                if (this.listeners('messageBuffer').length > 0) {
                    this.emit('messageBuffer', reply[1], reply[2]);
                }
                break;
            case 'pmessage':
                var pattern = reply[1].toString();
                if (this.listeners('pmessage').length > 0) {
                    this.emit('pmessage', pattern, reply[2].toString(), reply[3].toString());
                }
                if (this.listeners('pmessageBuffer').length > 0) {
                    this.emit('pmessageBuffer', pattern, reply[2], reply[3]);
                }
                break;
            case 'subscribe':
            case 'psubscribe':
                channel = reply[1].toString();
                this.condition.subscriber.add(replyType, channel);
                item = this.commandQueue.shift();
                if (!fillSubCommand(item.command, reply[2])) {
                    this.commandQueue.unshift(item);
                }
                break;
            case 'unsubscribe':
            case 'punsubscribe':
                channel = reply[1] ? reply[1].toString() : null;
                if (channel) {
                    this.condition.subscriber.del(replyType, channel);
                }
                count = reply[2];
                if (count === 0) {
                    this.condition.subscriber = false;
                }
                item = this.commandQueue.shift();
                if (!fillUnsubCommand(item.command, count)) {
                    this.commandQueue.unshift(item);
                }
                break;
            default:
                item = this.commandQueue.shift();
                item.command.resolve(reply);
        }
    }
    else {
        item = this.commandQueue.shift();
        if (!item) {
            return this.emit('error', new Error('Command queue state error. If you can reproduce this, please report it. Last reply: ' +
                reply.toString()));
        }
        if (command$1.checkFlag('ENTER_SUBSCRIBER_MODE', item.command.name)) {
            this.condition.subscriber = new SubscriptionSet$1();
            this.condition.subscriber.add(item.command.name, reply[1].toString());
            if (!fillSubCommand(item.command, reply[2])) {
                this.commandQueue.unshift(item);
            }
        }
        else if (command$1.checkFlag('EXIT_SUBSCRIBER_MODE', item.command.name)) {
            if (!fillUnsubCommand(item.command, reply[2])) {
                this.commandQueue.unshift(item);
            }
        }
        else {
            item.command.resolve(reply);
        }
    }
    function fillSubCommand(command, count) {
        if (typeof command.remainReplies === 'undefined') {
            command.remainReplies = command.args.length;
        }
        if (--command.remainReplies === 0) {
            command.resolve(count);
            return true;
        }
        return false;
    }
    function fillUnsubCommand(command, count) {
        if (typeof command.remainReplies === 'undefined') {
            command.remainReplies = command.args.length;
        }
        if (command.remainReplies === 0) {
            if (count === 0) {
                command.resolve(reply[2]);
                return true;
            }
            return false;
        }
        if (--command.remainReplies === 0) {
            command.resolve(reply[2]);
            return true;
        }
        return false;
    }
};

var parser$1 = {
	initParser: initParser,
	returnError: returnError,
	returnReply: returnReply
};

var EventEmitter = events.EventEmitter;






var debug$3 = debug_1$1('ioredis:redis');
var { StandaloneConnector: StandaloneConnector$1, SentinelConnector } = connectors;
var ScanStream$1 = ScanStream_1.default;


/**
 * Creates a Redis instance
 *
 * @constructor
 * @param {(number|string|Object)} [port=6379] - Port of the Redis server,
 * or a URL string(see the examples below),
 * or the `options` object(see the third argument).
 * @param {string|Object} [host=localhost] - Host of the Redis server,
 * when the first argument is a URL string,
 * this argument is an object represents the options.
 * @param {Object} [options] - Other options.
 * @param {number} [options.port=6379] - Port of the Redis server.
 * @param {string} [options.host=localhost] - Host of the Redis server.
 * @param {string} [options.family=4] - Version of IP stack. Defaults to 4.
 * @param {string} [options.path=null] - Local domain socket path. If set the `port`,
 * `host` and `family` will be ignored.
 * @param {number} [options.keepAlive=0] - TCP KeepAlive on the socket with a X ms delay before start.
 * Set to a non-number value to disable keepAlive.
 * @param {boolean} [options.noDelay=true] - Whether to disable the Nagle's Algorithm. By default we disable
 * it to reduce the latency.
 * @param {string} [options.connectionName=null] - Connection name.
 * @param {number} [options.db=0] - Database index to use.
 * @param {string} [options.password=null] - If set, client will send AUTH command
 * with the value of this option when connected.
 * @param {boolean} [options.dropBufferSupport=false] - Drop the buffer support for better performance.
 * This option is recommended to be enabled when
 * handling large array response and you don't need the buffer support.
 * @param {boolean} [options.enableReadyCheck=true] - When a connection is established to
 * the Redis server, the server might still be loading the database from disk.
 * While loading, the server not respond to any commands.
 * To work around this, when this option is `true`,
 * ioredis will check the status of the Redis server,
 * and when the Redis server is able to process commands,
 * a `ready` event will be emitted.
 * @param {boolean} [options.enableOfflineQueue=true] - By default,
 * if there is no active connection to the Redis server,
 * commands are added to a queue and are executed once the connection is "ready"
 * (when `enableReadyCheck` is `true`,
 * "ready" means the Redis server has loaded the database from disk, otherwise means the connection
 * to the Redis server has been established). If this option is false,
 * when execute the command when the connection isn't ready, an error will be returned.
 * @param {number} [options.connectTimeout=10000] - The milliseconds before a timeout occurs during the initial
 * connection to the Redis server.
 * @param {boolean} [options.autoResubscribe=true] - After reconnected, if the previous connection was in the
 * subscriber mode, client will auto re-subscribe these channels.
 * @param {boolean} [options.autoResendUnfulfilledCommands=true] - If true, client will resend unfulfilled
 * commands(e.g. block commands) in the previous connection when reconnected.
 * @param {boolean} [options.lazyConnect=false] - By default,
 * When a new `Redis` instance is created, it will connect to Redis server automatically.
 * If you want to keep disconnected util a command is called, you can pass the `lazyConnect` option to
 * the constructor:
 *
 * ```javascript
 * var redis = new Redis({ lazyConnect: true });
 * // No attempting to connect to the Redis server here.

 * // Now let's connect to the Redis server
 * redis.get('foo', function () {
 * });
 * ```
 * @param {Object} [options.tls] - TLS connection support. See https://github.com/luin/ioredis#tls-options
 * @param {string} [options.keyPrefix=''] - The prefix to prepend to all keys in a command.
 * @param {function} [options.retryStrategy] - See "Quick Start" section
 * @param {number} [options.maxRetriesPerRequest] - See "Quick Start" section
 * @param {function} [options.reconnectOnError] - See "Quick Start" section
 * @param {boolean} [options.readOnly=false] - Enable READONLY mode for the connection.
 * Only available for cluster mode.
 * @param {boolean} [options.stringNumbers=false] - Force numbers to be always returned as JavaScript
 * strings. This option is necessary when dealing with big numbers (exceed the [-2^53, +2^53] range).
 * @extends [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)
 * @extends Commander
 * @example
 * ```js
 * var Redis = require('ioredis');
 *
 * var redis = new Redis();
 *
 * var redisOnPort6380 = new Redis(6380);
 * var anotherRedis = new Redis(6380, '192.168.100.1');
 * var unixSocketRedis = new Redis({ path: '/tmp/echo.sock' });
 * var unixSocketRedis2 = new Redis('/tmp/echo.sock');
 * var urlRedis = new Redis('redis://user:password@redis-service.com:6379/');
 * var urlRedis2 = new Redis('//localhost:6379');
 * var authedRedis = new Redis(6380, '192.168.100.1', { password: 'password' });
 * ```
 */
function Redis() {
    if (!(this instanceof Redis)) {
        console.error(new Error('Calling `Redis()` like a function is deprecated. Using `new Redis()` instead.').stack.replace('Error', 'Warning'));
        return new Redis(arguments[0], arguments[1], arguments[2]);
    }
    this.parseOptions(arguments[0], arguments[1], arguments[2]);
    EventEmitter.call(this);
    commander.call(this);
    this.resetCommandQueue();
    this.resetOfflineQueue();
    if (this.options.sentinels) {
        this.connector = new SentinelConnector(this.options);
    }
    else {
        this.connector = new StandaloneConnector$1(this.options);
    }
    this.retryAttempts = 0;
    // end(or wait) -> connecting -> connect -> ready -> end
    if (this.options.lazyConnect) {
        this.setStatus('wait');
    }
    else {
        this.connect().catch(lodash.noop);
    }
}
util.inherits(Redis, EventEmitter);
Object.assign(Redis.prototype, commander.prototype);
/**
 * Create a Redis instance
 *
 * @deprecated
 */
Redis.createClient = function (...args) {
    return new Redis(...args);
};
/**
 * Default options
 *
 * @var defaultOptions
 * @private
 */
Redis.defaultOptions = {
    // Connection
    port: 6379,
    host: 'localhost',
    family: 4,
    connectTimeout: 10000,
    retryStrategy: function (times) {
        return Math.min(times * 50, 2000);
    },
    keepAlive: 0,
    noDelay: true,
    connectionName: null,
    // Sentinel
    sentinels: null,
    name: null,
    role: 'master',
    sentinelRetryStrategy: function (times) {
        return Math.min(times * 10, 1000);
    },
    // Status
    password: null,
    db: 0,
    // Others
    dropBufferSupport: false,
    enableOfflineQueue: true,
    enableReadyCheck: true,
    autoResubscribe: true,
    autoResendUnfulfilledCommands: true,
    lazyConnect: false,
    keyPrefix: '',
    reconnectOnError: null,
    readOnly: false,
    stringNumbers: false,
    maxRetriesPerRequest: 20
};
Redis.prototype.resetCommandQueue = function () {
    this.commandQueue = new denque();
};
Redis.prototype.resetOfflineQueue = function () {
    this.offlineQueue = new denque();
};
Redis.prototype.parseOptions = function () {
    this.options = {};
    for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        if (arg === null || typeof arg === 'undefined') {
            continue;
        }
        if (typeof arg === 'object') {
            lodash.defaults(this.options, arg);
        }
        else if (typeof arg === 'string') {
            lodash.defaults(this.options, utils.parseURL(arg));
        }
        else if (typeof arg === 'number') {
            this.options.port = arg;
        }
        else {
            throw new Error('Invalid argument ' + arg);
        }
    }
    lodash.defaults(this.options, Redis.defaultOptions);
    if (typeof this.options.port === 'string') {
        this.options.port = parseInt(this.options.port, 10);
    }
    if (typeof this.options.db === 'string') {
        this.options.db = parseInt(this.options.db, 10);
    }
    if (this.options.parser === 'hiredis') {
        console.warn('Hiredis parser is abandoned since ioredis v3.0, and JavaScript parser will be used');
    }
};
/**
 * Change instance's status
 * @private
 */
Redis.prototype.setStatus = function (status, arg) {
    var address;
    if (this.options.path) {
        address = this.options.path;
    }
    else if (this.stream && this.stream.remoteAddress && this.stream.remotePort) {
        address = this.stream.remoteAddress + ':' + this.stream.remotePort;
    }
    else {
        address = this.options.host + ':' + this.options.port;
    }
    debug$3('status[%s]: %s -> %s', address, this.status || '[empty]', status);
    this.status = status;
    process.nextTick(this.emit.bind(this, status, arg));
};
/**
 * Create a connection to Redis.
 * This method will be invoked automatically when creating a new Redis instance
 * unless `lazyConnect: true` is passed.
 *
 * When calling this method manually, a Promise is returned, which will
 * be resolved when the connection status is ready.
 * @param {function} [callback]
 * @return {Promise<void>}
 * @public
 */
Redis.prototype.connect = function (callback) {
    var Promise = promiseContainer.get();
    var promise = new Promise(function (resolve, reject) {
        if (this.status === 'connecting' || this.status === 'connect' || this.status === 'ready') {
            reject(new Error('Redis is already connecting/connected'));
            return;
        }
        this.setStatus('connecting');
        const { options } = this;
        this.condition = {
            select: options.db,
            auth: options.password,
            subscriber: false
        };
        var _this = this;
        this.connector.connect(function (err, stream$$1) {
            if (err) {
                _this.flushQueue(err);
                _this.silentEmit('error', err);
                reject(err);
                _this.setStatus('end');
                return;
            }
            var CONNECT_EVENT = options.tls ? 'secureConnect' : 'connect';
            _this.stream = stream$$1;
            if (typeof options.keepAlive === 'number') {
                stream$$1.setKeepAlive(true, options.keepAlive);
            }
            stream$$1.once(CONNECT_EVENT, event_handler.connectHandler(_this));
            stream$$1.once('error', event_handler.errorHandler(_this));
            stream$$1.once('close', event_handler.closeHandler(_this));
            stream$$1.on('data', event_handler.dataHandler(_this));
            if (options.connectTimeout) {
                stream$$1.setTimeout(options.connectTimeout, function () {
                    stream$$1.setTimeout(0);
                    stream$$1.destroy();
                    var err = new Error('connect ETIMEDOUT');
                    err.errorno = 'ETIMEDOUT';
                    err.code = 'ETIMEDOUT';
                    err.syscall = 'connect';
                    event_handler.errorHandler(_this)(err);
                });
                stream$$1.once(CONNECT_EVENT, function () {
                    stream$$1.setTimeout(0);
                });
            }
            if (options.noDelay) {
                stream$$1.setNoDelay(true);
            }
            var connectionReadyHandler = function () {
                _this.removeListener('close', connectionCloseHandler);
                resolve();
            };
            var connectionCloseHandler = function () {
                _this.removeListener('ready', connectionReadyHandler);
                reject(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
            };
            _this.once('ready', connectionReadyHandler);
            _this.once('close', connectionCloseHandler);
        }, function (type, err) {
            _this.silentEmit(type, err);
        });
    }.bind(this));
    return standardAsCallback(promise, callback);
};
/**
 * Disconnect from Redis.
 *
 * This method closes the connection immediately,
 * and may lose some pending replies that haven't written to client.
 * If you want to wait for the pending replies, use Redis#quit instead.
 * @public
 */
Redis.prototype.disconnect = function (reconnect) {
    if (!reconnect) {
        this.manuallyClosing = true;
    }
    if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
    }
    if (this.status === 'wait') {
        event_handler.closeHandler(this)();
    }
    else {
        this.connector.disconnect();
    }
};
/**
 * Disconnect from Redis.
 *
 * @deprecated
 */
Redis.prototype.end = function () {
    this.disconnect();
};
/**
 * Create a new instance with the same options as the current one.
 *
 * @example
 * ```js
 * var redis = new Redis(6380);
 * var anotherRedis = redis.duplicate();
 * ```
 *
 * @public
 */
Redis.prototype.duplicate = function (override) {
    return new Redis(Object.assign(lodash.cloneDeep(this.options), override || {}));
};
/**
 * Flush offline queue and command queue with error.
 *
 * @param {Error} error - The error object to send to the commands
 * @param {object} options
 * @private
 */
Redis.prototype.flushQueue = function (error, options) {
    options = lodash.defaults({}, options, {
        offlineQueue: true,
        commandQueue: true
    });
    var item;
    if (options.offlineQueue) {
        while (this.offlineQueue.length > 0) {
            item = this.offlineQueue.shift();
            item.command.reject(error);
        }
    }
    if (options.commandQueue) {
        if (this.commandQueue.length > 0) {
            if (this.stream) {
                this.stream.removeAllListeners('data');
            }
            while (this.commandQueue.length > 0) {
                item = this.commandQueue.shift();
                item.command.reject(error);
            }
        }
    }
};
/**
 * Check whether Redis has finished loading the persistent data and is able to
 * process commands.
 *
 * @param {Function} callback
 * @private
 */
Redis.prototype._readyCheck = function (callback) {
    var _this = this;
    this.info(function (err, res) {
        if (err) {
            return callback(err);
        }
        if (typeof res !== 'string') {
            return callback(null, res);
        }
        var info = {};
        var lines = res.split('\r\n');
        for (var i = 0; i < lines.length; ++i) {
            var parts = lines[i].split(':');
            if (parts[1]) {
                info[parts[0]] = parts[1];
            }
        }
        if (!info.loading || info.loading === '0') {
            callback(null, info);
        }
        else {
            var retryTime = (info.loading_eta_seconds || 1) * 1000;
            debug$3('Redis server still loading, trying again in ' + retryTime + 'ms');
            setTimeout(function () {
                _this._readyCheck(callback);
            }, retryTime);
        }
    });
};
/**
 * Emit only when there's at least one listener.
 *
 * @param {string} eventName - Event to emit
 * @param {...*} arguments - Arguments
 * @return {boolean} Returns true if event had listeners, false otherwise.
 * @private
 */
Redis.prototype.silentEmit = function (eventName) {
    var error;
    if (eventName === 'error') {
        error = arguments[1];
        if (this.status === 'end') {
            return;
        }
        if (this.manuallyClosing) {
            // ignore connection related errors when manually disconnecting
            if (error instanceof Error &&
                (error.message === utils.CONNECTION_CLOSED_ERROR_MSG ||
                    error.syscall === 'connect' ||
                    error.syscall === 'read')) {
                return;
            }
        }
    }
    if (this.listeners(eventName).length > 0) {
        return this.emit.apply(this, arguments);
    }
    if (error && error instanceof Error) {
        console.error('[ioredis] Unhandled error event:', error.stack);
    }
    return false;
};
/**
 * Listen for all requests received by the server in real time.
 *
 * This command will create a new connection to Redis and send a
 * MONITOR command via the new connection in order to avoid disturbing
 * the current connection.
 *
 * @param {function} [callback] The callback function. If omit, a promise will be returned.
 * @example
 * ```js
 * var redis = new Redis();
 * redis.monitor(function (err, monitor) {
 *   // Entering monitoring mode.
 *   monitor.on('monitor', function (time, args, source, database) {
 *     console.log(time + ": " + util.inspect(args));
 *   });
 * });
 *
 * // supports promise as well as other commands
 * redis.monitor().then(function (monitor) {
 *   monitor.on('monitor', function (time, args, source, database) {
 *     console.log(time + ": " + util.inspect(args));
 *   });
 * });
 * ```
 * @public
 */
Redis.prototype.monitor = function (callback) {
    var monitorInstance = this.duplicate({
        monitor: true,
        lazyConnect: false
    });
    var Promise = promiseContainer.get();
    return standardAsCallback(new Promise(function (resolve) {
        monitorInstance.once('monitoring', function () {
            resolve(monitorInstance);
        });
    }), callback);
};
transaction.addTransactionSupport(Redis.prototype);
/**
 * Send a command to Redis
 *
 * This method is used internally by the `Redis#set`, `Redis#lpush` etc.
 * Most of the time you won't invoke this method directly.
 * However when you want to send a command that is not supported by ioredis yet,
 * this command will be useful.
 *
 * @method sendCommand
 * @memberOf Redis#
 * @param {Command} command - The Command instance to send.
 * @see {@link Command}
 * @example
 * ```js
 * var redis = new Redis();
 *
 * // Use callback
 * var get = new Command('get', ['foo'], 'utf8', function (err, result) {
 *   console.log(result);
 * });
 * redis.sendCommand(get);
 *
 * // Use promise
 * var set = new Command('set', ['foo', 'bar'], 'utf8');
 * set.promise.then(function (result) {
 *   console.log(result);
 * });
 * redis.sendCommand(set);
 * ```
 * @private
 */
Redis.prototype.sendCommand = function (command, stream$$1) {
    if (this.status === 'wait') {
        this.connect().catch(lodash.noop);
    }
    if (this.status === 'end') {
        command.reject(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
        return command.promise;
    }
    if (this.condition.subscriber && !command$1.checkFlag('VALID_IN_SUBSCRIBER_MODE', command.name)) {
        command.reject(new Error('Connection in subscriber mode, only subscriber commands may be used'));
        return command.promise;
    }
    var writable = (this.status === 'ready') ||
        (!stream$$1 && (this.status === 'connect') && redisCommands.hasFlag(command.name, 'loading'));
    if (!this.stream) {
        writable = false;
    }
    else if (!this.stream.writable) {
        writable = false;
    }
    else if (this.stream._writableState && this.stream._writableState.ended) {
        // https://github.com/iojs/io.js/pull/1217
        writable = false;
    }
    if (!writable && !this.options.enableOfflineQueue) {
        command.reject(new Error('Stream isn\'t writeable and enableOfflineQueue options is false'));
        return command.promise;
    }
    if (!writable && command.name === 'quit' && this.offlineQueue.length === 0) {
        this.disconnect();
        command.resolve(Buffer.from('OK'));
        return command.promise;
    }
    if (writable) {
        debug$3('write command[%d] -> %s(%s)', this.condition.select, command.name, command.args);
        (stream$$1 || this.stream).write(command.toWritable());
        this.commandQueue.push({
            command: command,
            stream: stream$$1,
            select: this.condition.select
        });
        if (command$1.checkFlag('WILL_DISCONNECT', command.name)) {
            this.manuallyClosing = true;
        }
    }
    else if (this.options.enableOfflineQueue) {
        debug$3('queue command[%d] -> %s(%s)', this.condition.select, command.name, command.args);
        this.offlineQueue.push({
            command: command,
            stream: stream$$1,
            select: this.condition.select
        });
    }
    if (command.name === 'select' && utils.isInt(command.args[0])) {
        var db = parseInt(command.args[0], 10);
        if (this.condition.select !== db) {
            this.condition.select = db;
            this.emit('select', db);
            debug$3('switch to db [%d]', this.condition.select);
        }
    }
    return command.promise;
};
['scan', 'sscan', 'hscan', 'zscan', 'scanBuffer', 'sscanBuffer', 'hscanBuffer', 'zscanBuffer']
    .forEach(function (command) {
    Redis.prototype[command + 'Stream'] = function (key, options) {
        if (command === 'scan' || command === 'scanBuffer') {
            options = key;
            key = null;
        }
        return new ScanStream$1(lodash.defaults({
            objectMode: true,
            key: key,
            redis: this,
            command: command
        }, options));
    };
});
Object.assign(Redis.prototype, parser$1);
var redis = Redis;

var ConnectionPool_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const debug = debug_1$1('ioredis:cluster:connectionPool');
class ConnectionPool extends events.EventEmitter {
    constructor(redisOptions) {
        super();
        this.redisOptions = redisOptions;
        // master + slave = all
        this.nodes = {
            all: {},
            master: {},
            slave: {}
        };
        this.specifiedOptions = {};
    }
    /**
     * Find or create a connection to the node
     *
     * @param {IRedisOptions} node
     * @param {boolean} [readOnly=false]
     * @returns {*}
     * @memberof ConnectionPool
     */
    findOrCreate(node, readOnly = false) {
        setKey(node);
        readOnly = Boolean(readOnly);
        if (this.specifiedOptions[node.key]) {
            Object.assign(node, this.specifiedOptions[node.key]);
        }
        else {
            this.specifiedOptions[node.key] = node;
        }
        let redis$$1;
        if (this.nodes.all[node.key]) {
            redis$$1 = this.nodes.all[node.key];
            if (redis$$1.options.readOnly !== readOnly) {
                redis$$1.options.readOnly = readOnly;
                debug('Change role of %s to %s', node.key, readOnly ? 'slave' : 'master');
                redis$$1[readOnly ? 'readonly' : 'readwrite']().catch(lodash.noop);
                if (readOnly) {
                    delete this.nodes.master[node.key];
                    this.nodes.slave[node.key] = redis$$1;
                }
                else {
                    delete this.nodes.slave[node.key];
                    this.nodes.master[node.key] = redis$$1;
                }
            }
        }
        else {
            debug('Connecting to %s as %s', node.key, readOnly ? 'slave' : 'master');
            redis$$1 = new redis(lodash.defaults({
                // Never try to reconnect when a node is lose,
                // instead, waiting for a `MOVED` error and
                // fetch the slots again.
                retryStrategy: null,
                // Offline queue should be enabled so that
                // we don't need to wait for the `ready` event
                // before sending commands to the node.
                enableOfflineQueue: true,
                readOnly: readOnly
            }, node, this.redisOptions, { lazyConnect: true }));
            this.nodes.all[node.key] = redis$$1;
            this.nodes[readOnly ? 'slave' : 'master'][node.key] = redis$$1;
            redis$$1.once('end', () => {
                delete this.nodes.all[node.key];
                delete this.nodes.master[node.key];
                delete this.nodes.slave[node.key];
                this.emit('-node', redis$$1);
                if (!Object.keys(this.nodes.all).length) {
                    this.emit('drain');
                }
            });
            this.emit('+node', redis$$1);
            redis$$1.on('error', function (error) {
                this.emit('nodeError', error);
            });
        }
        return redis$$1;
    }
    /**
     * Reset the pool with a set of nodes.
     * The old node will be removed.
     *
     * @param {(Array<string | number | object>)} nodes
     * @memberof ConnectionPool
     */
    reset(nodes) {
        const newNodes = {};
        nodes.forEach((node) => {
            const options = {};
            if (typeof node === 'object') {
                lodash.defaults(options, node);
            }
            else if (typeof node === 'string') {
                lodash.defaults(options, utils.parseURL(node));
            }
            else if (typeof node === 'number') {
                options.port = node;
            }
            else {
                throw new Error('Invalid argument ' + node);
            }
            if (typeof options.port === 'string') {
                options.port = parseInt(options.port, 10);
            }
            delete options.db;
            setKey(options);
            newNodes[options.key] = options;
        }, this);
        Object.keys(this.nodes.all).forEach((key) => {
            if (!newNodes[key]) {
                debug('Disconnect %s because the node does not hold any slot', key);
                this.nodes.all[key].disconnect();
            }
        });
        Object.keys(newNodes).forEach((key) => {
            const node = newNodes[key];
            this.findOrCreate(node, node.readOnly);
        });
    }
}
exports.default = ConnectionPool;
/**
 * Set key property
 *
 * @private
 */
function setKey(node) {
    node = node || {};
    node.port = node.port || 6379;
    node.host = node.host || '127.0.0.1';
    node.key = node.key || node.host + ':' + node.port;
    return node;
}
});

unwrapExports(ConnectionPool_1);

var DelayQueue_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const debug = debug_1$1('ioredis:delayqueue');
/**
 * Queue that runs items after specified duration
 *
 * @export
 * @class DelayQueue
 */
class DelayQueue {
    constructor() {
        this.queues = {};
        this.timeouts = {};
    }
    /**
     * Add a new item to the queue
     *
     * @param {string} bucket bucket name
     * @param {Function} item function that will run later
     * @param {IDelayQueueOptions} options
     * @memberof DelayQueue
     */
    push(bucket, item, options) {
        const callback = options.callback || process.nextTick;
        if (!this.queues[bucket]) {
            this.queues[bucket] = new denque();
        }
        const queue = this.queues[bucket];
        queue.push(item);
        if (!this.timeouts[bucket]) {
            this.timeouts[bucket] = setTimeout(() => {
                callback(() => {
                    this.timeouts[bucket] = null;
                    this.execute(bucket);
                });
            }, options.timeout);
        }
    }
    execute(bucket) {
        const queue = this.queues[bucket];
        if (!queue) {
            return;
        }
        const { length } = queue;
        if (!length) {
            return;
        }
        debug('send %d commands in %s queue', length, bucket);
        this.queues[bucket] = null;
        while (queue.length > 0) {
            queue.shift()();
        }
    }
}
exports.default = DelayQueue;
});

unwrapExports(DelayQueue_1);

var EventEmitter$1 = events.EventEmitter;
var debug$4 = debug_1$1('ioredis:cluster');

var ScanStream$2 = ScanStream_1.default;




var ConnectionPool$1 = ConnectionPool_1.default;
var DelayQueue$1 = DelayQueue_1.default;

/**
 * Creates a Redis Cluster instance
 *
 * @constructor
 * @param {Object[]} startupNodes - An array of nodes in the cluster, [{ port: number, host: string }]
 * @param {Object} options
 * @param {function} [options.clusterRetryStrategy] - See "Quick Start" section
 * @param {boolean} [options.enableOfflineQueue=true] - See Redis class
 * @param {boolean} [options.enableReadyCheck=true] - When enabled, ioredis only emits "ready" event when `CLUSTER INFO`
 * command reporting the cluster is ready for handling commands.
 * @param {string} [options.scaleReads=master] - Scale reads to the node with the specified role.
 * Available values are "master", "slave" and "all".
 * @param {number} [options.maxRedirections=16] - When a MOVED or ASK error is received, client will redirect the
 * command to another node. This option limits the max redirections allowed to send a command.
 * @param {number} [options.retryDelayOnFailover=100] - When an error is received when sending a command(e.g.
 * "Connection is closed." when the target Redis node is down),
 * @param {number} [options.retryDelayOnClusterDown=100] - When a CLUSTERDOWN error is received, client will retry
 * if `retryDelayOnClusterDown` is valid delay time.
 * @param {number} [options.retryDelayOnTryAgain=100] - When a TRYAGAIN error is received, client will retry
 * if `retryDelayOnTryAgain` is valid delay time.
 * @param {number} [options.slotsRefreshTimeout=1000] - The milliseconds before a timeout occurs while refreshing
 * slots from the cluster.
 * @param {number} [options.slotsRefreshInterval=5000] - The milliseconds between every automatic slots refresh.
 * @param {Object} [options.redisOptions] - Passed to the constructor of `Redis`.
 * @extends [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)
 * @extends Commander
 */
function Cluster(startupNodes, options) {
    EventEmitter$1.call(this);
    commander.call(this);
    this.options = lodash.defaults(this.options, options, Cluster.defaultOptions);
    // validate options
    if (typeof this.options.scaleReads !== 'function' &&
        ['all', 'master', 'slave'].indexOf(this.options.scaleReads) === -1) {
        throw new Error('Invalid option scaleReads "' + this.options.scaleReads +
            '". Expected "all", "master", "slave" or a custom function');
    }
    this.connectionPool = new ConnectionPool$1(this.options.redisOptions);
    this.startupNodes = startupNodes;
    var _this = this;
    this.connectionPool.on('-node', function (redis$$1) {
        if (_this.status !== 'disconnecting' && _this.subscriber === redis$$1) {
            _this.selectSubscriber();
        }
        _this.emit('-node', redis$$1);
    });
    this.connectionPool.on('+node', function (redis$$1) {
        _this.emit('+node', redis$$1);
    });
    this.connectionPool.on('drain', function () {
        _this.setStatus('close');
    });
    this.connectionPool.on('nodeError', function (error) {
        _this.emit('node error', error);
    });
    this.slots = [];
    this.retryAttempts = 0;
    this.resetOfflineQueue();
    this.delayQueue = new DelayQueue$1();
    this.subscriber = null;
    if (this.options.lazyConnect) {
        this.setStatus('wait');
    }
    else {
        this.connect().catch(lodash.noop);
    }
}
/**
 * Default options
 *
 * @var defaultOptions
 * @private
 */
Cluster.defaultOptions = {
    clusterRetryStrategy: function (times) {
        return Math.min(100 + times * 2, 2000);
    },
    enableOfflineQueue: true,
    enableReadyCheck: true,
    scaleReads: 'master',
    maxRedirections: 16,
    retryDelayOnFailover: 100,
    retryDelayOnClusterDown: 100,
    retryDelayOnTryAgain: 100,
    slotsRefreshTimeout: 1000,
    slotsRefreshInterval: 5000
};
util.inherits(Cluster, EventEmitter$1);
Object.assign(Cluster.prototype, commander.prototype);
Cluster.prototype.resetOfflineQueue = function () {
    this.offlineQueue = new denque();
};
Cluster.prototype.resetNodesRefreshInterval = function () {
    if (this.slotsTimer) {
        return;
    }
    this.slotsTimer = setInterval(function () {
        this.refreshSlotsCache();
    }.bind(this), this.options.slotsRefreshInterval);
};
/**
 * Connect to a cluster
 *
 * @return {Promise}
 * @public
 */
Cluster.prototype.connect = function () {
    var Promise = promiseContainer.get();
    return new Promise(function (resolve, reject) {
        if (this.status === 'connecting' || this.status === 'connect' || this.status === 'ready') {
            reject(new Error('Redis is already connecting/connected'));
            return;
        }
        this.setStatus('connecting');
        if (!Array.isArray(this.startupNodes) || this.startupNodes.length === 0) {
            throw new Error('`startupNodes` should contain at least one node.');
        }
        this.connectionPool.reset(this.startupNodes);
        function readyHandler() {
            this.setStatus('ready');
            this.retryAttempts = 0;
            this.executeOfflineCommands();
            this.resetNodesRefreshInterval();
            resolve();
        }
        var closeListener;
        var refreshListener = function () {
            this.removeListener('close', closeListener);
            this.manuallyClosing = false;
            this.setStatus('connect');
            if (this.options.enableReadyCheck) {
                this._readyCheck(function (err, fail) {
                    if (err || fail) {
                        debug$4('Ready check failed (%s). Reconnecting...', err || fail);
                        if (this.status === 'connect') {
                            this.disconnect(true);
                        }
                    }
                    else {
                        readyHandler.call(this);
                    }
                }.bind(this));
            }
            else {
                readyHandler.call(this);
            }
        };
        closeListener = function () {
            this.removeListener('refresh', refreshListener);
            reject(new Error('None of startup nodes is available'));
        };
        this.once('refresh', refreshListener);
        this.once('close', closeListener);
        this.once('close', this._handleCloseEvent.bind(this));
        this.refreshSlotsCache(function (err) {
            if (err && err.message === 'Failed to refresh slots cache.') {
                redis.prototype.silentEmit.call(this, 'error', err);
                this.connectionPool.reset([]);
            }
        }.bind(this));
        this.selectSubscriber();
    }.bind(this));
};
/**
 * Called when closed to check whether a reconnection should be made
 *
 * @private
 */
Cluster.prototype._handleCloseEvent = function () {
    var retryDelay;
    if (!this.manuallyClosing && typeof this.options.clusterRetryStrategy === 'function') {
        retryDelay = this.options.clusterRetryStrategy.call(this, ++this.retryAttempts);
    }
    if (typeof retryDelay === 'number') {
        this.setStatus('reconnecting');
        this.reconnectTimeout = setTimeout(function () {
            this.reconnectTimeout = null;
            debug$4('Cluster is disconnected. Retrying after %dms', retryDelay);
            this.connect().catch(function (err) {
                debug$4('Got error %s when reconnecting. Ignoring...', err);
            });
        }.bind(this), retryDelay);
    }
    else {
        this.setStatus('end');
        this.flushQueue(new Error('None of startup nodes is available'));
    }
};
/**
 * Disconnect from every node in the cluster.
 * @param {boolean} [reconnect]
 * @public
 */
Cluster.prototype.disconnect = function (reconnect) {
    var status = this.status;
    this.setStatus('disconnecting');
    if (!reconnect) {
        this.manuallyClosing = true;
    }
    if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
        debug$4('Canceled reconnecting attempts');
    }
    if (this.slotsTimer) {
        clearInterval(this.slotsTimer);
        this.slotsTimer = null;
    }
    if (status === 'wait') {
        this.setStatus('close');
        this._handleCloseEvent();
    }
    else {
        this.connectionPool.reset([]);
    }
};
/**
 * Quit the cluster gracefully.
 *
 * @param {function} [callback]
 * @return {Promise} return 'OK' if successfully
 * @public
 */
Cluster.prototype.quit = function (callback) {
    var status = this.status;
    this.setStatus('disconnecting');
    this.manuallyClosing = true;
    if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
    }
    if (this.slotsTimer) {
        clearInterval(this.slotsTimer);
        this.slotsTimer = null;
    }
    var Promise = promiseContainer.get();
    if (status === 'wait') {
        var ret = standardAsCallback(Promise.resolve('OK'), callback);
        // use setImmediate to make sure "close" event
        // being emitted after quit() is returned
        setImmediate(function () {
            this.setStatus('close');
            this._handleCloseEvent();
        }.bind(this));
        return ret;
    }
    return standardAsCallback(Promise.all(this.nodes().map(function (node) {
        return node.quit();
    })).then(function () {
        return 'OK';
    }), callback);
};
/**
 * Get nodes with the specified role
 *
 * @param {string} [role=all] - role, "master", "slave" or "all"
 * @return {Redis[]} array of nodes
 * @public
 */
Cluster.prototype.nodes = function (role) {
    role = role || 'all';
    if (role !== 'all' && role !== 'master' && role !== 'slave') {
        throw new Error('Invalid role "' + role + '". Expected "all", "master" or "slave"');
    }
    return lodash.values(this.connectionPool.nodes[role]);
};
/**
 * Select a subscriber from the cluster
 *
 * @private
 */
Cluster.prototype.selectSubscriber = function () {
    this.subscriber = lodash.sample(this.nodes());
    if (!this.subscriber) {
        return;
    }
    // Re-subscribe previous channels
    var previousChannels = { subscribe: [], psubscribe: [] };
    if (this.lastActiveSubscriber && this.lastActiveSubscriber.prevCondition) {
        var subscriber = this.lastActiveSubscriber.prevCondition.subscriber;
        if (subscriber) {
            previousChannels.subscribe = subscriber.channels('subscribe');
            previousChannels.psubscribe = subscriber.channels('psubscribe');
        }
    }
    var _this = this;
    if (previousChannels.subscribe.length || previousChannels.psubscribe.length) {
        var pending = 0;
        lodash.forEach(['subscribe', 'psubscribe'], function (type) {
            var channels = previousChannels[type];
            if (channels.length) {
                pending += 1;
                debug$4('%s %d channels', type, channels.length);
                _this.subscriber[type](channels).then(function () {
                    if (!--pending) {
                        _this.lastActiveSubscriber = _this.subscriber;
                    }
                }).catch(lodash.noop);
            }
        });
    }
    else {
        if (this.subscriber.status === 'wait') {
            this.subscriber.connect().catch(lodash.noop);
        }
        this.lastActiveSubscriber = this.subscriber;
    }
    lodash.forEach(['message', 'messageBuffer'], function (event) {
        _this.subscriber.on(event, function (arg1, arg2) {
            _this.emit(event, arg1, arg2);
        });
    });
    lodash.forEach(['pmessage', 'pmessageBuffer'], function (event) {
        _this.subscriber.on(event, function (arg1, arg2, arg3) {
            _this.emit(event, arg1, arg2, arg3);
        });
    });
};
/**
 * Change cluster instance's status
 *
 * @param {string} status
 * @private
 */
Cluster.prototype.setStatus = function (status) {
    debug$4('status: %s -> %s', this.status || '[empty]', status);
    this.status = status;
    process.nextTick(this.emit.bind(this, status));
};
/**
 * Refresh the slot cache
 *
 * @param {function} [callback]
 * @private
 */
Cluster.prototype.refreshSlotsCache = function (callback) {
    if (this.isRefreshing) {
        if (typeof callback === 'function') {
            process.nextTick(callback);
        }
        return;
    }
    this.isRefreshing = true;
    var _this = this;
    var wrapper = function () {
        _this.isRefreshing = false;
        if (typeof callback === 'function') {
            callback.apply(null, arguments);
        }
    };
    var keys = lodash.shuffle(Object.keys(this.connectionPool.nodes.all));
    var lastNodeError = null;
    function tryNode(index) {
        if (index === keys.length) {
            var error = new Error('Failed to refresh slots cache.');
            error.lastNodeError = lastNodeError;
            return wrapper(error);
        }
        debug$4('getting slot cache from %s', keys[index]);
        _this.getInfoFromNode(_this.connectionPool.nodes.all[keys[index]], function (err) {
            if (_this.status === 'end') {
                return wrapper(new Error('Cluster is disconnected.'));
            }
            if (err) {
                _this.emit('node error', err);
                lastNodeError = err;
                tryNode(index + 1);
            }
            else {
                _this.emit('refresh');
                wrapper();
            }
        });
    }
    tryNode(0);
};
/**
 * Flush offline queue with error.
 *
 * @param {Error} error - The error object to send to the commands
 * @private
 */
Cluster.prototype.flushQueue = function (error) {
    var item;
    while (this.offlineQueue.length > 0) {
        item = this.offlineQueue.shift();
        item.command.reject(error);
    }
};
Cluster.prototype.executeOfflineCommands = function () {
    if (this.offlineQueue.length) {
        debug$4('send %d commands in offline queue', this.offlineQueue.length);
        var offlineQueue = this.offlineQueue;
        this.resetOfflineQueue();
        while (offlineQueue.length > 0) {
            var item = offlineQueue.shift();
            this.sendCommand(item.command, item.stream, item.node);
        }
    }
};
Cluster.prototype.sendCommand = function (command, stream$$1, node) {
    if (this.status === 'wait') {
        this.connect().catch(lodash.noop);
    }
    if (this.status === 'end') {
        command.reject(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
        return command.promise;
    }
    var to = this.options.scaleReads;
    if (to !== 'master') {
        var isCommandReadOnly = redisCommands.exists(command.name) && redisCommands.hasFlag(command.name, 'readonly');
        if (!isCommandReadOnly) {
            to = 'master';
        }
    }
    var targetSlot = node ? node.slot : command.getSlot();
    var ttl = {};
    var _this = this;
    if (!node && !command.__is_reject_overwritten) {
        command.__is_reject_overwritten = true;
        var reject = command.reject;
        command.reject = function (err) {
            var partialTry = lodash.partial(tryConnection, true);
            _this.handleError(err, ttl, {
                moved: function (slot, key) {
                    debug$4('command %s is moved to %s', command.name, key);
                    if (_this.slots[slot]) {
                        _this.slots[slot][0] = key;
                    }
                    else {
                        _this.slots[slot] = [key];
                    }
                    var splitKey = key.split(':');
                    _this.connectionPool.findOrCreate({ host: splitKey[0], port: Number(splitKey[1]) });
                    tryConnection();
                    _this.refreshSlotsCache();
                },
                ask: function (slot, key) {
                    debug$4('command %s is required to ask %s:%s', command.name, key);
                    var splitKey = key.split(':');
                    _this.connectionPool.findOrCreate({ host: splitKey[0], port: Number(splitKey[1]) });
                    tryConnection(false, key);
                },
                tryagain: partialTry,
                clusterDown: partialTry,
                connectionClosed: partialTry,
                maxRedirections: function (redirectionError) {
                    reject.call(command, redirectionError);
                },
                defaults: function () {
                    reject.call(command, err);
                }
            });
        };
    }
    tryConnection();
    function tryConnection(random, asking) {
        if (_this.status === 'end') {
            command.reject(new Error('Cluster is ended.'));
            return;
        }
        var redis$$1;
        if (_this.status === 'ready' || (command.name === 'cluster')) {
            if (node && node.redis) {
                redis$$1 = node.redis;
            }
            else if (command$1.checkFlag('ENTER_SUBSCRIBER_MODE', command.name) ||
                command$1.checkFlag('EXIT_SUBSCRIBER_MODE', command.name)) {
                redis$$1 = _this.subscriber;
            }
            else {
                if (!random) {
                    if (typeof targetSlot === 'number' && _this.slots[targetSlot]) {
                        var nodeKeys = _this.slots[targetSlot];
                        if (typeof to === 'function') {
                            var nodes = nodeKeys
                                .map(function (key) {
                                return _this.connectionPool.nodes.all[key];
                            });
                            redis$$1 = to(nodes, command);
                            if (Array.isArray(redis$$1)) {
                                redis$$1 = utils.sample(redis$$1);
                            }
                            if (!redis$$1) {
                                redis$$1 = nodes[0];
                            }
                        }
                        else {
                            var key;
                            if (to === 'all') {
                                key = utils.sample(nodeKeys);
                            }
                            else if (to === 'slave' && nodeKeys.length > 1) {
                                key = utils.sample(nodeKeys, 1);
                            }
                            else {
                                key = nodeKeys[0];
                            }
                            redis$$1 = _this.connectionPool.nodes.all[key];
                        }
                    }
                    if (asking) {
                        redis$$1 = _this.connectionPool.nodes.all[asking];
                        redis$$1.asking();
                    }
                }
                if (!redis$$1) {
                    redis$$1 = lodash.sample(_this.connectionPool.nodes[to]) ||
                        lodash.sample(_this.connectionPool.nodes.all);
                }
            }
            if (node && !node.redis) {
                node.redis = redis$$1;
            }
        }
        if (redis$$1) {
            redis$$1.sendCommand(command, stream$$1);
        }
        else if (_this.options.enableOfflineQueue) {
            _this.offlineQueue.push({
                command: command,
                stream: stream$$1,
                node: node
            });
        }
        else {
            command.reject(new Error('Cluster isn\'t ready and enableOfflineQueue options is false'));
        }
    }
    return command.promise;
};
Cluster.prototype.handleError = function (error, ttl, handlers) {
    if (typeof ttl.value === 'undefined') {
        ttl.value = this.options.maxRedirections;
    }
    else {
        ttl.value -= 1;
    }
    if (ttl.value <= 0) {
        handlers.maxRedirections(new Error('Too many Cluster redirections. Last error: ' + error));
        return;
    }
    var errv = error.message.split(' ');
    if (errv[0] === 'MOVED' || errv[0] === 'ASK') {
        handlers[errv[0] === 'MOVED' ? 'moved' : 'ask'](errv[1], errv[2]);
    }
    else if (errv[0] === 'TRYAGAIN') {
        this.delayQueue.push('tryagain', handlers.tryagain, {
            timeout: this.options.retryDelayOnTryAgain
        });
    }
    else if (errv[0] === 'CLUSTERDOWN' && this.options.retryDelayOnClusterDown > 0) {
        this.delayQueue.push('clusterdown', handlers.connectionClosed, {
            timeout: this.options.retryDelayOnClusterDown,
            callback: this.refreshSlotsCache.bind(this)
        });
    }
    else if (error.message === utils.CONNECTION_CLOSED_ERROR_MSG &&
        this.options.retryDelayOnFailover > 0 &&
        this.status === 'ready') {
        this.delayQueue.push('failover', handlers.connectionClosed, {
            timeout: this.options.retryDelayOnFailover,
            callback: this.refreshSlotsCache.bind(this)
        });
    }
    else {
        handlers.defaults();
    }
};
Cluster.prototype.getInfoFromNode = function (redis$$1, callback) {
    if (!redis$$1) {
        return callback(new Error('Node is disconnected'));
    }
    var _this = this;
    redis$$1.cluster('slots', utils.timeout(function (err, result) {
        if (err) {
            redis$$1.disconnect();
            return callback(err);
        }
        var nodes = [];
        for (var i = 0; i < result.length; ++i) {
            var items = result[i];
            var slotRangeStart = items[0];
            var slotRangeEnd = items[1];
            var keys = [];
            for (var j = 2; j < items.length; j++) {
                items[j] = { host: items[j][0], port: items[j][1] };
                items[j].readOnly = j !== 2;
                nodes.push(items[j]);
                keys.push(items[j].host + ':' + items[j].port);
            }
            for (var slot = slotRangeStart; slot <= slotRangeEnd; slot++) {
                _this.slots[slot] = keys;
            }
        }
        _this.connectionPool.reset(nodes);
        callback();
    }, this.options.slotsRefreshTimeout));
};
/**
 * Check whether Cluster is able to process commands
 *
 * @param {Function} callback
 * @private
 */
Cluster.prototype._readyCheck = function (callback) {
    this.cluster('info', function (err, res) {
        if (err) {
            return callback(err);
        }
        if (typeof res !== 'string') {
            return callback();
        }
        var state;
        var lines = res.split('\r\n');
        for (var i = 0; i < lines.length; ++i) {
            var parts = lines[i].split(':');
            if (parts[0] === 'cluster_state') {
                state = parts[1];
                break;
            }
        }
        if (state === 'fail') {
            debug$4('cluster state not ok (%s)', state);
            callback(null, state);
        }
        else {
            callback();
        }
    });
};
['sscan', 'hscan', 'zscan', 'sscanBuffer', 'hscanBuffer', 'zscanBuffer']
    .forEach(function (command) {
    Cluster.prototype[command + 'Stream'] = function (key, options) {
        return new ScanStream$2(lodash.defaults({
            objectMode: true,
            key: key,
            redis: this,
            command: command
        }, options));
    };
});
transaction.addTransactionSupport(Cluster.prototype);
var cluster$1 = Cluster;

var built = createCommonjsModule(function (module, exports) {
exports = module.exports = redis;
exports.ReplyError = redisErrors.ReplyError;
exports.Cluster = cluster$1;
exports.Command = command$1;
exports.ScanStream = ScanStream_1.default;
exports.Pipeline = pipeline;

Object.defineProperty(exports, 'Promise', {
    get: function () {
        return promiseContainer.get();
    },
    set: function (lib) {
        promiseContainer.set(lib);
    }
});
exports.print = function (err, reply) {
    if (err) {
        console.log('Error: ' + err);
    }
    else {
        console.log('Reply: ' + reply);
    }
};
});
var built_1 = built.ReplyError;
var built_2 = built.Cluster;
var built_3 = built.Command;
var built_4 = built.ScanStream;
var built_5 = built.Pipeline;
var built_6 = built.print;

var _driver$prototype;

function driver() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  this.db = new built(config);
  this.keyBase = "codi"; //   console.log("redis");
}

var tasks = new Tasks();
var activities = new Activities();
driver.prototype = (_driver$prototype = {
  saveTask: tasks.saveTask,
  getTask: tasks.getTask,
  removeTask: tasks.removeTask,
  getTasks: tasks.getTasks,
  getTasksRaw: tasks.getTasksRaw,
  getActivity: activities.getActivity,
  saveActivity: activities.saveActivity,
  getActivities: activities.getActivities,
  getActiveActivities: activities.getActiveActivities,
  getActivitiesRaw: activities.getActivitiesRaw,
  getDueActivities: activities.getDueActivities,
  getNextRunDelay: activities.getNextRunDelay,
  dropActivities: activities.clean
}, _defineProperty(_driver$prototype, "getNextRunDelay", activities.getNextRunDelay), _defineProperty(_driver$prototype, "recreateActivity", activities.recreateActivity), _driver$prototype);

var driver$1 = new driver(); //tasks

var updateDeposits = function updateDeposits(activity, done) {
  console.log("Update deposits done---------!", activity.attrs.data); //   return new Promise((r,j)=>j(1))

  done();
};

var sendEmails = function sendEmails(activity, done) {
  console.log("Send emails done---------!", activity.attrs.data);
  done();
};

var updateAccounts = function updateAccounts(activity, done) {
  console.log("updateAccounts done-------!", activity.attrs); //   return new Promise((r,j)=>r(1))

  done();
};

_asyncToGenerator(
/*#__PURE__*/
regenerator.mark(function _callee() {
  var codic;
  return regenerator.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          codic = new Codic(driver$1);
          _context.prev = 1;
          _context.next = 4;
          return codic.assign("update deposits", {}, updateDeposits);

        case 4:
          _context.next = 6;
          return codic.assign("send emails", {
            priority: 1
          }, updateAccounts);

        case 6:
          _context.next = 8;
          return codic.assign("update accounts", {
            priority: 2
          }, sendEmails);

        case 8:
          _context.next = 10;
          return codic.run(["send emails", "update accounts"]).every(3).use({
            username: "Jon"
          }).save();

        case 10:
          _context.next = 12;
          return codic.start();

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[1, 14]]);
}))();
