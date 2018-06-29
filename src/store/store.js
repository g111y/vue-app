import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	token: sessionStorage.getItem('token'),
	host: `http://${window.location.hostname}:3000/`,
	system: sessionStorage.getItem('system'),
	user: JSON.parse(sessionStorage.getItem('user') || '{}'),

	//会员推广sae服务器api地址
	wxAppHost:`http://ggyy.applinzi.com/api/v1/admin/`
};

const mutations = {
	setToken(state, payload) {
		sessionStorage.setItem('token', payload.token);
		sessionStorage.setItem('system', payload.system);
		sessionStorage.setItem('user', JSON.stringify(payload.user));
		state.token = payload.token;
		state.system = payload.system;
		state.user = payload.user;
	},
	removeToken(state) {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('system');
		sessionStorage.removeItem('admin');
		state.token = undefined;
		state.system = undefined;
		state.user = undefined;
	}
};

export default new Vuex.Store({
	state,
	mutations
});
