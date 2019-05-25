function all() {
    let listener = {
        'updateList': [],
        'updateLikes': [],
        'updateComments': [],
    }
    function addListenr(type, fn) {
        listener[type].push(fn)
    }
    function did(type, ...params) {
        for(var i = 0 ; i < listener[type].length; i ++) {
            listener[type][i](params)
        }
    }
    function del(type, fn) {
        listener[type] = listener[type].filter(item => {
            return item !== fn
        })
    }
    return {
        add: addListenr,
        del: del,
        did: did,
    }
}