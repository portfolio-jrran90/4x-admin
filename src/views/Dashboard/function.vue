<script>
	import { Header } from '../Header'
	import { Sidemenu } from '../Sidemenu'
	import { Loader } from '../../components/Loader'
	
	var Dashboard = {
		components:{
			Header,
			Sidemenu,
			Loader,
		},
		data() {
			return {
				showLoader : false,
			}
		},
		created() {
		},
		methods: {
      showLoading() {
      	this.showLoader = true;
      },
      hideLoading() {
      	setTimeout(()=>{
				  this.showLoader = false;
				},500);
      },
    }
	}
	export default Dashboard
</script>