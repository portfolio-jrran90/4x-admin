<script>
	import axios from 'axios';

	var Header = {
		data() {
			return {
				requestedHeaders: {
					headers: {
						Authorization: process.env.VUE_APP_AUTHORIZATION,
						'x-access-token': localStorage.getItem("auth_token")
					}
				},
				isShowUserProfileMenu: false,
			}
		},
		created() {
			this.initializeShowHideListener();
			this.actionAdmin();
		},
		methods: {
			decodeJwt(paramToken) {
				const b64DecodeUnicode = str =>
				decodeURIComponent(
					Array.prototype.map.call(atob(str), c =>
					'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				).join(''));

				const parseJwt = token =>
				JSON.parse(
					b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
				);

				return parseJwt(paramToken)
			},
			/*
			 * For ShowHide Toggle Event Listeners
			 */
      initializeShowHideListener()	{
				let vm = this
				window.addEventListener("click",function(e){
					if(vm.isShowUserProfileMenu){
						var el = e.target;
						var parentSelector = document.getElementsByClassName('user-header-toggle')[0];
						if (parentSelector === undefined) {
							parentSelector = document;
						}
						var p = el.parentNode;
						var parentMatch = false;
						if(p == parentSelector){
							parentMatch = true;
						}else{
							while (p !== parentSelector) {
								var o = p;
								if(o == null){
									break;
								}
								p = o.parentNode;
								if(p == parentSelector){
									parentMatch = true;
								}
							}
						}
						vm.isShowUserProfileMenu = parentMatch;
					}
				});
			},

			logout() {
				this.actionAdmin('admin logout')
				this.$auth.logout({
					// makeRequest: true,
					success() {},
					error() {},
					redirect: "/login"
				});
			},
			actionAdmin(paramsAction) {
				let vm = this
				const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
				// vm.getDataAdminLogin(adminLogin._id)

				delete adminLogin.iat
				delete adminLogin.mobileNumber
				delete adminLogin._id

				let actionAdmin = {
					adminLogin,
					action: paramsAction,
				}
				actionAdmin = JSON.stringify(actionAdmin)
				axios.post('https://mon.empatkali.co.id/cs', { actionAdmin })
					.then(res => {
						console.log('res', res)
					})
					.catch(err => {
						console.log(err.res)
					})
				// console.log('actionAdmin', actionAdmin)
			},
    }
	}
	export default Header
</script>