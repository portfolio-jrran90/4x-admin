<script>
	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	// import axios from 'axios'
	var Users = {
		components:	{
			Header,
			Loader
		},
		data() {
			return {
				loader:	{
					isShow: true,
					message: 'Preparing'
				}
			}
		},
		created() {
			this.getUsersList();
		},
		methods: {
      getUsersList()	{
				let vm = this

				setTimeout(() => {
					vm.loader.isShow = false;
				}, 500);
			},
			/**
			 * Toggle Loader
			 */
			toggleLoader(opt){
				let vm = this
				vm.loader.isShow = opt;
			},
    }
	}
	export default Users
</script>