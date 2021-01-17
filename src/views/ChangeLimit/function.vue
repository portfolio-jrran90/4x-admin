<script>
	// import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'

	var ChangeLimit = {
		components:	{
			Header,
			Loader,
		},
		data() {
			return {
				requestedHeaders: {
					headers: {
						Authorization: process.env.VUE_APP_AUTHORIZATION,
						'x-access-token': localStorage.getItem("auth_token")
					}
				},
				loader:	{
					isShow: true,
					message: 'Preparing',
				},
			}
		},
		created() {
		},
		methods: {
			
    }
	}
	export default ChangeLimit
</script>