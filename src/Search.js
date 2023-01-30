import latinize from "latinize";

const Search = {
    matches: function (value, search) {
        return value != null &&
            search != null &&
            typeof value === 'string' &&
            latinize(value.toString().toLowerCase()).indexOf(latinize(search.toLowerCase())) !== -1
    },
    matchesAnyValues: function (values, search) {
        return values.some((value) => {
            return Search.matches(value, search)
        });
    }
}
export default Search;
