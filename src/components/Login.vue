<template>
    <div class="container">
        <div class="row justify-content-md-center">
            <div class="col col-md-4">
                <div class="card mt-5">
                    <div class="card-header text-center">
                        <h2>Login</h2>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login()">
                            <div class="form-group row">
                                <div class="col-sm-12">
                                    <input type="email" class="form-control" id="inputEmail" placeholder="Email"
                                           v-model="data.body.email">
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-12">
                                    <input type="password" class="form-control" id="inputPassword" placeholder="Password"
                                           v-model="data.body.password">
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-12">
                                    <button type="submit" class="btn btn-block btn-primary">Sign in</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        console.log('redirect', this.$auth.redirect())
    },
    data() {
        return {
            context: 'login context',
            data: {
                body: {
                    email: 'admin@admin.com',
                    password: '123456'
                },
                rememberMe: false,
                fetchUser: true
            },
            error: null
        }
    },
    methods: {
        login() {
            let vm = this
            let redirect = vm.$auth.redirect()
            vm.$auth.login({
                body: vm.data.body, // Vue-resource
                data: vm.data.body, // Axios
                rememberMe: vm.data.rememberMe,
                redirect: {name: redirect ? redirect.from.name : 'account'},
                fetchUser: vm.data.fetchUser
            }).then(() => {
                // console.log('success ' + this.context);
            }, (res) => {
                /*console.log('error ' + this.context);
                this.error = res.data;*/
            })
            /*vm.$auth.login({
                data: {
                    email: vm.email,
                    password: vm.password
                },
                success: function(res) {
                    console.log('response', res.data)
                },
                error: function(err) {
                    console.log('error', err)
                },
                fetchUser: false
            })*/
        }
    }
}
</script>
