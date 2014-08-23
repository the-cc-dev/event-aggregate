/**
 * Module dependencies.
 */

var debug = require('debug')('event-aggregate');
var Emitter = require('events').EventEmitter;
var assert = require('assert');
var slice = Array.prototype.slice;

/**
 * Expose 'Aggregate'.
 */

exports = module.exports = Aggregate;

/**
 * 'Aggregate' prototype.
 */

var aggregate = Aggregate.prototype;

/**
 * Create a new 'Aggregate'.
 *
 * @param {Object} emitters
 * @param {Object} opts
 * @api public
 */

function Aggregate(emitters) {
  assert('object' == typeof emitters, 'Emitters should be an object');
  if (!(this instanceof Aggregate)) return new Aggregate(emitters);
  this.attachListeners(emitters);

  return this;
};

/**
 * Inherit from `Emitter.prototype`.
 */

Aggregate.prototype.__proto__ = Emitter.prototype;

/**
 * Attach listeners.
 *
 * @param {Object} emitters
 * @api private
 */

aggregate.attachListeners = function(emitters) {
  var self = this;

  Object.keys(emitters).forEach(function(key) {
    emitters[key].forEach(function(emitter) {
      emitter.on(key, emit.bind(self, key));
    });
  });
}

/**
 * Emit an event with the same argument that's
 * passed to the function. We're doing strange
 * things with arguments here, but you need
 * not be scared.
 *
 * @param {String} eventName
 * @param {Mixed[]} otherArgs
 * @api private
 */

function emit() {
  var originalArgs = arguments;
  var args = [];

  debug('Received event: ' + originalArgs[0]);

  Object.keys(originalArgs).forEach(function(key) {
    args.push(originalArgs[key]);
  })

  this.emit.apply(this, args);
}