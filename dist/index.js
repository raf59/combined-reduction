"use strict";
var _ = require('lodash');
var deepUpdate = require('deep-update');
/**
 * Combines **both** keyed reducers and top level reducers in any order.
 *
 * top level reducers are passed directly, and keyed reducers are passed as a
 * mapping of mount points to reducers.
 */
function combinedReduction() {
    var reducers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        reducers[_i - 0] = arguments[_i];
    }
    var dispatchPairs = _.reduce(reducers, function (m, r) { return m.concat(_findReducers(r)); }, []);
    return function (state, action) {
        //if (state === void 0) { state = {}; }
        for (var _i = 0, dispatchPairs_1 = dispatchPairs; _i < dispatchPairs_1.length; _i++) {
            var _a = dispatchPairs_1[_i], path = _a[0], reducer = _a[1];
            var currentState = path.length === 0 ? state : _.get(state, path);
            var newState = void 0;
            try {
                newState = reducer(currentState, action);
            }
            catch (error) {
                console.error("Error in reducer mounted at " + path.join('.') + ":", error);
                continue;
            }
            if (currentState === newState)
                continue;
            state = deepUpdate(state, path, { $set: newState });
        }
        return state;
    };
}
/**
 * Expands `reducer` into pairs for easy dispatching.
 */
function _findReducers(reducer, basePath) {
    if (basePath === void 0) { basePath = []; }
    if (!reducer)
        return []; // blank entries are ok.
    if (_.isFunction(reducer)) {
        // The easy case, we just have a reducer function to be immediately mounted:
        return [[basePath, reducer]];
    }
    if (!_.isPlainObject(reducer)) {
        throw new TypeError("Cannot combine reducer of type " + typeof reducer + " at " + basePath.join('.'));
    }
    return _.reduce(reducer, function (result, config, key) {
        return result.concat(_findReducers(config, basePath.concat(key)));
    }, []);
}
module.exports = combinedReduction;
