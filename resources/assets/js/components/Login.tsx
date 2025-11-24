import React from "react";
import { Form, Input, Button, Checkbox } from "antd"; // ✅ Antd imports
import "../../css/bootstrap.min.css";
import "../../css/common.css";
import "../../css/main.css";
import "../../css/responsive.css";

// Import images so Vite resolves and bundles them correctly
import shape1 from '../../images/shape1.svg';
import darkShape from '../../images/dark_shape.svg';
import shape2 from '../../images/shape2.svg';
import darkShape1 from '../../images/dark_shape1.svg';
import shape3 from '../../images/shape3.svg';
import darkShape2 from '../../images/dark_shape2.svg';
import loginImg from '../../images/login.png';
import logoImg from '../../images/logo.svg';
import googleImg from '../../images/google.svg';
import { loginUser } from "../auth";

const Login = ({ onLogin, onNavigateToRegister }) => {

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const onFinish = async (values: { email: string; password: string }) => {
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const user = await loginUser(values.email, values.password);
      onLogin(user);
    } catch (err: any) {
      if (err?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : (v as string);
        });
        setFieldErrors(mapped);
        setError(err.message || 'Validation error');
      } else {
        setError(err?.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      {/* Shapes */}
      <div className="_shape_one">
        <img src={shape1} alt="" className="_shape_img" />
        <img src={darkShape} alt="" className="_dark_shape" />
      </div>

      <div className="_shape_two">
        <img src={shape2} alt="" className="_shape_img" />
        <img src={darkShape1} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>

      <div className="_shape_three">
        <img src={shape3} alt="" className="_shape_img" />
        <img src={darkShape2} alt="" className="_dark_shape _dark_shape_opacity" />
      </div>

      {/* Login container */}
      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">

            {/* Left Illustration */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img src={loginImg} alt="Login Illustration" className="_left_img" />
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">

                <div className="_social_login_left_logo _mar_b28">
                  <img src={logoImg} alt="Logo" className="_left_logo" />
                </div>

                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">
                  Login to your account
                </h4>

                <button type="button" className="_social_login_content_btn _mar_b40">
                  <img src={googleImg} alt="Google Login" className="_google_img" />
                  <span>Or sign-in with Google</span>
                </button>

                <div className="_social_login_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  className="_social_login_form"
                  initialValues={{ remember: true }}
                >
                 
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Email is required!" },
                      { type: "email", message: "Enter a valid email!" },
                    ]}
                  >
                    <Input className="_social_login_input" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Password is required!" }]}
                  >
                    <Input.Password className="_social_login_input" size="large" />
                  </Form.Item>

                  <div className="row">
                    <div className="col-6">
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </div>

                    <div className="col-6 text-end">
                      <p className="_social_login_form_left_para">Forgot password?</p>
                    </div>
                  </div>

                  <Form.Item className="_mar_t40 _mar_b60">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="_social_login_form_btn_link _btn1"
                      block
                      size="large"
                    >
                      Login now
                    </Button>
                  </Form.Item>
                </Form>

                <div className="_social_login_bottom_txt">
                  <p className="_social_login_bottom_txt_para">
                    Don’t have an account? <a  onClick={onNavigateToRegister}>Create New Account</a>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Login;
