export default {
  namespaced: true,
  state: {
    current_token: '',
    next_token: '',
    level: ''
  },
  mutations: {
    SET_USER (state, pyload) {
      state.current_token = pyload.current_token
      state.next_token = pyload.next_token
      state.level = pyload.level
    }
  },
  actions: {
    changeUserInfo ({state, commit}, pyload) {
      return commit('SET_USER', pyload)
    }
  }
}
