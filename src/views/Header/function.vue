<script>
	var Header = {
		data() {
			return {
				isShowUserProfileMenu: false,
			}
		},
		created() {
			this.initializeListeners();
		},
		methods: {
			/*
			 * For Event Listeners
			 */
      initializeListeners()	{
				let vm = this
				window.addEventListener("click",function(e){
					
					if(vm.isShowUserProfileMenu){
						var el = e.target;
						var parentSelector = document.getElementsByClassName('parent-toggle')[0];
						if (parentSelector === undefined) {
							parentSelector = document;
						}
						var p = el.parentNode;
						var parentMatch = false;
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
						vm.isShowUserProfileMenu = parentMatch;
					}
				});
			},
    }
	}
	export default Header
</script>