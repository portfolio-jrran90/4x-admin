<script>
	// import axios from 'axios'
	var Users = {
		data() {
			return {
				
			}
		},
		created() {
			this.getUsersList();
		},
		methods: {
      getUsersList()	{
				let vm = this
				vm.$parent.showLoading();

				setTimeout(() => {
					vm.$parent.hideLoading();
				}, 500);
			}
    }
	}
	export default Users
</script>