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
    },
    SET_CURRENT_TOKEN_MINUS (state, pyload) {
      state.current_token -= pyload
    },
    SET_NEXT_TOKEN_MINUS (state, pyload) {
      state.next_token -= pyload
    },
    SET_CURRENT_TOKEN_ADD (state, pyload) {
      state.current_token += pyload
    },
    SET_NEXT_TOKEN_ADD (state, pyload) {
      state.next_token += pyload
    }
  },
  actions: {
    changeUserInfo ({state, commit}, pyload) {
      return commit('SET_USER', pyload)
    },
    minusCurrentToken ({state, commit}, pyload) {
      return commit('SET_CURRENT_TOKEN_MINUS', pyload)
    },
    minusNextToken ({state, commit}, pyload) {
      return commit('SET_NEXT_TOKEN_MINUS', pyload)
    },
    addCurrentToken ({state, commit}, pyload) {
      return commit('SET_CURRENT_TOKEN_ADD', pyload)
    },
    addNextToken ({state, commit}, pyload) {
      return commit('SET_NEXT_TOKEN_ADD', pyload)
    }
  }
}
