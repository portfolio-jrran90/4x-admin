<script>
	var Sidemenu = {
		data() {
			return {
				isShowUserChildMenu: false,
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
					
					if(vm.isShowUserChildMenu){
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
						vm.isShowUserChildMenu = parentMatch;
					}
				});
			},
    }
	}
	export default Sidemenu
</script>