export = combinedReduction;
declare module combinedReduction {
    type Action = {
        type: string;
    };
    type Reducer = (state: {}, action: Action) => {};
    type ReducerMap = {
        [key: string]: Reducer | ReducerMap;
    };
    type ReducerOrMap = Reducer | ReducerMap;
}
/**
 * Combines **both** keyed reducers and top level reducers in any order.
 *
 * top level reducers are passed directly, and keyed reducers are passed as a
 * mapping of mount points to reducers.
 */
declare function combinedReduction(...reducers: (combinedReduction.ReducerOrMap)[]): combinedReduction.Reducer;
