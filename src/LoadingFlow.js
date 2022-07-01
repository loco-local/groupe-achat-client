let loadingFlows = [];
export default {
    enter: function () {
        loadingFlows.push(true)
    },
    enterNoSpinner: function () {
        loadingFlows.push(false)
    },
    leave: function () {
        loadingFlows.pop();
    },
    loadingFlows: loadingFlows
}
