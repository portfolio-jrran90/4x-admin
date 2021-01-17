<script>
	var Sidemenu = {
		data() {
			return {
				isShowUserChildMenu: false,
			}
		},
		created() {
			this.initializeShowHideListener();
		},
		methods: {
			/*
			 * For ShowHide Toggle Event Listeners
			 */
      initializeShowHideListener()	{
				let vm = this
				document.addEventListener("click",function(e){
					if(vm.isShowUserChildMenu){
						var el = e.target;
						var parentSelector = document.getElementsByClassName('sidemenu-user-toggle')[0];
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
						vm.isShowUserChildMenu = parentMatch;
					}
				});
			},
    }
	}
	export default Sidemenu
</script>