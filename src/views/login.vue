<template>
    <div class="login-container">
        <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <h3 class="title">{{title}}</h3>
            <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                  <svg-icon icon-class="user"/>
                </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="邮箱"/>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input name="password" type="password" @keyup.enter.native="toLogin" v-model="loginForm.password" autoComplete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="toLogin">登录</el-button>
            </el-form-item>
            <div class="tips">
                <span>王海权©2019</span>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {login} from '@/api/login'

    var routers = [];

    export default {
        name: 'Login',
        data() {
            const validateUsername = (rule, value, callback) => {
                if (value.length < 3) {
                    callback(new Error('请输入正确的邮箱地址'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 3) {
                    callback(new Error('密码不能小于6位'));
                } else {
                    callback();
                }
            };

            return {
                title: '智美运动',
                loading: false,
                loginForm: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}]
                }
            }
        },
        methods: {
            toLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        login(this.loginForm.username, this.loginForm.password).then(res => {
                            this.loading = false;
                            let {code, msg, data} = res;
                            if (code !== 200) {
                                this.$message({type: 'error', message: msg})
                            } else {
                                sessionStorage.setItem('user', JSON.stringify(data));
                                this.$router.push({path: '/'})
                            }
                        });
                    } else {
                        return false
                    }
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b;
    $light_gray: #eee;

    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: #fff !important;
                }
            }
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .login-container {
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: $bg;
        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            max-width: 450px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            -moz-border-radius: 5px;
        }
        .tips {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.1);
            margin-bottom: 10px;
            text-align: center;
            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
            &_login {
                font-size: 20px;
            }
        }
        .title {
            font-size: 26px;
            font-weight: 400;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
</style>
